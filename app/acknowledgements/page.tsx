import { Link, ScrollShadow } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import { pageTitle, sectionTitle } from "@/components/primitives";
import webLicenses from "@/public/licenses/paperwave-web-licenses.txt";
import cliLicenses from "@/public/licenses/paperwave-cli-licenses.txt";


export default function Acknowledgements() {
  const t = useTranslations("Acknowledgements");

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <h1 className={pageTitle()}>{t("Acknowledgements")}</h1>
      <p className="text-default-700">
        {t(
          "This work was supported by JSPS KAKENHI Grant Number JP22KJ1010 and Nakayama Future Factory We would like to thank the collaborators of the field study and the design workshop for their valuable insights and feedback",
        )}
      </p>
      <h2 className={sectionTitle()}>
        {t("Open Source Libraries")} - PaperWave Web
      </h2>
      <Link
        isExternal
        showAnchorIcon
        href="https://github.com/nae-lab/paperwave-web"
      >
        https://github.com/nae-lab/paperwave-web
      </Link>
      <div className="h-[50vh] w-full bg-default-100 p-4 rounded-lg">
        <ScrollShadow className="h-full w-full">
          <pre className="w-full overflow-y-scroll text-xs">{webLicenses}</pre>
        </ScrollShadow>
      </div>
      <h2 className={sectionTitle()}>
        {t("Open Source Libraries")} - PaperWave CLI
      </h2>
      <Link
        isExternal
        showAnchorIcon
        href="https://github.com/nae-lab/paperwave-cli"
      >
        https://github.com/nae-lab/paperwave-cli
      </Link>
      <div className="h-[50vh] w-full bg-default-100 p-4 rounded-lg">
        <ScrollShadow className="h-full w-full">
          <pre className="w-full overflow-y-scroll text-xs">{cliLicenses}</pre>
        </ScrollShadow>
      </div>
    </div>
  );
}
