import { componentsPath, getFolderPath, getProjectType } from '@appworks/project-service';


export const bulkGenerate = async function (blocks: any) {
  const projectType = await getProjectType();

  let outputPath = componentsPath;

  if (projectType === 'unknown') {
    // select folder path
    outputPath = await getFolderPath();
  }
  return [];
};

export {  };
