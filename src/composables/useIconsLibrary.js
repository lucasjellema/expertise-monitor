import conclusionLogo from '@/assets/CONCLUSIONlogo.png'
import conclusionExperienceLogo from '@/assets/conclusion_exprience.png'
import conclusionLowCodeCompanyLogo from '@/assets/conclusionLowCodeCompany.png'
import amisLogo from '@/assets/amis.jpeg'
import conclusionEnablementLogo from '@/assets/conclusionEnablement.jpeg'
export function useIconsLibrary() {

const companyLogos = {'Conclusion': conclusionLogo
  , 'Conclusion Experience': conclusionExperienceLogo
  , 'Conclusion Low Code Company': conclusionLowCodeCompanyLogo
,'AMIS': amisLogo
,'Conclusion Enablement': conclusionEnablementLogo
}



  const tipTypeIconMap = {
    verblijf: 'mdi-bed',
    restaurant: 'mdi-silverware-fork-knife',
    activiteit: 'mdi-walk'
}

  return { tipTypeIconMap , companyLogos};
}
