import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const t = await getTranslations("Settings");

  return (
    <div>
      <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
        {t("Settings")}
      </h1>
      <p>{t("Currently, there are no settings available")}</p>
    </div>
  );
}
