#!/bin/sh

mkdir -p tmp
rm -rf tmp/paperwave-cli

git clone 'https://github.com/nae-lab/paperwave-cli.git' --depth 1 --branch dev --single-branch --quiet tmp/paperwave-cli

(cd tmp/paperwave-cli && pnpm licenses list -P --long > ../../public/licenses/paperwave-cli-licenses.txt && cd ../..)

rm -rf tmp/paperwave-cli
