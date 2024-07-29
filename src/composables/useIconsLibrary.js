import conclusionLogo from '@/assets/CONCLUSIONlogo.png'
import conclusionExperienceLogo from '@/assets/conclusion_exprience.png'
import conclusionLowCodeCompanyLogo from '@/assets/conclusionLowCodeCompany.png'
import amisLogo from '@/assets/amis.jpeg'
import conclusionEnablementLogo from '@/assets/conclusionEnablement.jpeg'
import conclusionConfidentialLogo from '@/assets/conclusionConfidential.jpg'
import accelerateLogo from '@/assets/accelerate.jpeg'
import casLogo from '@/assets/cas.jpeg'
import cmcLogo from '@/assets/cmc.png'
import foreyetLogo from '@/assets/conclusionForeyet.jpg'
import futureFactsLogo from '@/assets/conclusionConfidential.jpg'
import virtualSciencesLogo from '@/assets/virtualSciences.jpeg'
import mybrandLogo from '@/assets/mybrand.jpeg'
import morgensLogo from '@/assets/morgens.jpg'
import mediaanLogo from '@/assets/mediaan.jpg'
import mbsLogo from '@/assets/mbs.jpg'
import kwdLogo from '@/assets/kwd.jpg'
import furoreLogo from '@/assets/furore.jpeg'
import first8Logo from '@/assets/first8.jpeg'
import dnaLogo from '@/assets/dna.png'
import yellowtailLogo from '@/assets/yellowtail.jpeg'
import consultingLogo from '@/assets/conclusionConsulting.jpg'
import xforceLogo from '@/assets/xforce.jpeg'
import hotitemLogo from '@/assets/hotitem.jpeg'
import brightalleyLogo from '@/assets/brightalleyLogo.jpeg'
import thefactoreLogo from '@/assets/thefactorElogo.png'
import arlanetLogo from '@/assets/arlanetLogo.png'

export function useIconsLibrary() {

  const companyLogos = {
    'Conclusion': conclusionLogo
    , 'Conclusion Experience': conclusionExperienceLogo
    , 'Conclusion Low Code Company': conclusionLowCodeCompanyLogo
    , 'AMIS': amisLogo
    , 'Conclusion Enablement': conclusionEnablementLogo

    , 'Accelerate!': accelerateLogo
    , 'Conclusion AFAS Solutions': casLogo
    , 'Conclusion Mission Critical': cmcLogo
    , 'Conclusion ForeyeT': foreyetLogo
    , 'FutureFacts': futureFactsLogo
    , 'Virtual Sciences': virtualSciencesLogo
    , 'myBrand': mybrandLogo
    , 'Morgens': morgensLogo
    , 'Mediaan': mediaanLogo
    , 'Conclusion MBS': mbsLogo
    , 'KWD Resultaat Management': kwdLogo
    , 'Furore': furoreLogo
    , 'First8': first8Logo
    , 'D&A Medical Group': dnaLogo
    , 'Conclusion Consulting': consultingLogo  
    , 'Yellowtail': yellowtailLogo
    , 'Conclusion Xforce': xforceLogo
    , 'Hot ITem': hotitemLogo
    , 'Conclusion Confidential': conclusionConfidentialLogo
    , 'BrightAlley': brightalleyLogo
    , 'theFactor.e': thefactoreLogo
    , 'ArlaNet': arlanetLogo
  }



  const tipTypeIconMap = {
    verblijf: 'mdi-bed',
    restaurant: 'mdi-silverware-fork-knife',
    activiteit: 'mdi-walk'
  }

  return { tipTypeIconMap, companyLogos };
}
