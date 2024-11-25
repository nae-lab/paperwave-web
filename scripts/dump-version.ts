const { execSync } = require("child_process");

const output = execSync("pnpm list --depth 0 --json", { encoding: "utf-8" });
const packages = JSON.parse(output);

// Only output the version of this package
packages.forEach((pkg: any) => {
  console.log(pkg.version);
});
