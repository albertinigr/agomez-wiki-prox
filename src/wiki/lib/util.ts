export const buildWikiUrl = ({
  path,
  locale,
  section,
  date,
}: {
  path: string;
  locale: string;
  section: string;
  date: string;
}) => {
  return `${path}/${locale}/${section}/${date}`;
};
