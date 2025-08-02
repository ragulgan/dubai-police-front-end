
export const getCreatedByName = (data: any) => {
  let createdByName = "---";
  if (data && data.createdFirstname)
    createdByName = data.createdFirstname;

  if (data && data.createdMiddlename)
    createdByName = `${createdByName} ${data.createdMiddlename}`;

  if (data && data.createdSurname)
    createdByName = `${createdByName} ${data.createdSurname}`;

  return createdByName.trim();
}