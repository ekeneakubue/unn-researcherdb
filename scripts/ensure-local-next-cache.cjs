/**
 * OneDrive-synced Desktop makes `.next` slow. Point it at a local AppData
 * directory via a Windows directory junction (or a Unix symlink).
 */
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const projectRoot = path.join(__dirname, "..");
const nextDir = path.join(projectRoot, ".next");
const targetDir = path.join(
  process.env.LOCALAPPDATA || path.join(require("node:os").homedir(), ".cache"),
  "unn-researchdb",
  "next-cache",
);

function isLink(dir) {
  try {
    return fs.lstatSync(dir).isSymbolicLink();
  } catch {
    return false;
  }
}

function sameTarget() {
  try {
    return path.resolve(fs.readlinkSync(nextDir)) === path.resolve(targetDir);
  } catch {
    return false;
  }
}

fs.mkdirSync(targetDir, { recursive: true });

if (isLink(nextDir) && sameTarget()) {
  process.exit(0);
}

if (fs.existsSync(nextDir)) {
  if (isLink(nextDir)) {
    fs.rmSync(nextDir, { force: true });
  } else {
    const backup = path.join(projectRoot, ".next-onedrive-backup");
    try {
      if (fs.existsSync(backup)) {
        fs.rmSync(backup, { recursive: true, force: true });
      }
      fs.renameSync(nextDir, backup);
      console.log(`[next-cache] Moved OneDrive .next → ${backup}`);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "EPERM") {
        console.error(
          "[next-cache] Could not move .next (is `npm run dev` still running?). Stop the server, then run npm run dev again.",
        );
        process.exit(1);
      }
      throw error;
    }
  }
}

if (process.platform === "win32") {
  execFileSync("cmd", ["/c", "mklink", "/J", nextDir, targetDir], {
    stdio: "inherit",
  });
} else {
  fs.symlinkSync(targetDir, nextDir, "dir");
}

console.log(`[next-cache] Linked .next → ${targetDir}`);
