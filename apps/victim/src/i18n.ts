import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
void i18n.use(initReactI18next).init({lng:'en',fallbackLng:'en',interpolation:{escapeValue:false},resources:{en:{translation:{home:'Home',talk:'Talk',support:'My Support',journal:'Journal',more:'More',counselor:'Counselor queue',district:'District operations',state:'State monitoring',national:'National monitoring'}}}});
export default i18n;

