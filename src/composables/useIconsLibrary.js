import conclusionLogo from '@/assets/CONCLUSIONlogo.png'
import conclusionExperienceLogo from '@/assets/conclusion_exprience.png'
import conclusionLowCodeCompanyLogo from '@/assets/conclusionLowCodeCompany.png'
export function useIconsLibrary() {

const companyLogos = {'Conclusion': conclusionLogo
  , 'Conclusion Experience': conclusionExperienceLogo, 'Conclusion Low Code Company': conclusionLowCodeCompanyLogo}



  const tipTypeIconMap = {
    verblijf: 'mdi-bed',
    restaurant: 'mdi-silverware-fork-knife',
    activiteit: 'mdi-walk'
}

  return { tipTypeIconMap , companyLogos};
}
