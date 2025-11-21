// app/locales.ts

// 1. Definimos primero el objeto en Inglés "base"
const en = {
    headerTitle: "Client Intake Form",
    languageSelector: "Language / Idioma",
    switchLang: "Cambiar a Español",

    // Section Titles
    personalInfoTitle: "CLIENT INFORMATION",
    medicalHistoryTitle: "MEDICAL HISTORY",
    massageInfoTitle: "MASSAGE INFORMATION",
    consentTitle: "CONSENT & RELEASE",

    // Labels Personal Info
    label_name: "Name:",
    label_dob: "Date of Birth:",
    label_age: "Age:",
    label_gender: "Gender:",
    label_address: "Address:",
    label_city: "City:",
    label_state: "State:",
    label_zip: "Zip Code:",
    label_phone: "Phone:",
    label_email: "Email:",
    label_emergency: "Emergency Contact:",
    label_emailList: "Would like to be added to to our email list for news and exclusive offers?",
    label_howHeard: "How did you hear about us?",

    // Medical Prompts
    medical_prompt_conditions: "Do you have any of the following conditions (check all that apply):",
    medical_prompt_other_issues: "Do you have any other medical issues not mentioned in this form?",
    medical_prompt_procedures: "Have you had any recent medical procedures or surgeries?",
    medical_prompt_pregnant: "Are you currently pregnant or breastfeeding? (For female clients, if applicable.)",
    medical_prompt_meds: "Are you currently taking any medications?",
    label_if_yes_specify: "If yes, please specify:",
    label_other: "Other:",

    // Massage Info Prompts
    massage_prompt_type: "What type of massage are you interested in? (Select all that apply)",
    massage_prompt_areas: "Any specific areas of tension or pain to address? (Select all that apply)",
    massage_prompt_goals: "What are your goals for this massage session? (Select all that apply)",
    massage_prompt_frequency: "How often do you receive massages?",

    // Radio/Checkbox Options
    option_relaxation: "Relaxation",
    option_swedish: "Swedish",
    option_therapeutic: "Therapeutic",
    option_hot_stone: "Hot stone",
    option_deep_tissue: "Deep tissue",
    option_reflexology: "Reflexology",
    option_neck: "Neck",
    option_shoulders: "Shoulders",
    option_back: "Back",
    option_hips: "Hips",
    option_legs: "Legs",
    option_feet: "Feet",
    option_stress_reduction: "Stress reduction",
    option_pain_relief: "Pain relief",
    option_injury_recovery: "Injury recovery",
    option_increased_flexibility: "Increased flexibility",

    // Frequency options (claves dinámicas)
    option_first_time: "This is my first time",
    option_occasionally: "Occasionally",
    option_regularly: "Regularly",
    option_rarely: "Rarely",

    yes: "Yes",
    no: "No",

    // Legal Text
    legal_p1: "I, the undersigned, hereby give my consent for Between Curves Massage to perform massage therapy services for me. I understand that these services will include a consultation prior to the appointment and various massage techniques to achieve my desired outcomes.",
    legal_p2: "I acknowledge that massage therapy involves physical manipulation that may pose certain risks, including soreness, bruising, or allergic reactions to oils or lotions. I am responsible for informing the therapist of any medical conditions, allergies, or sensitivities I may have.",
    legal_p3: "By signing this consent form, I release Between Curves Massage from any liability for accidents, injuries, or damages that may occur during the massage services provided. I understand that while every effort will be made to ensure a safe and satisfactory experience, unforeseen circumstances may arise.",
    legal_p4: "I recognize that if I need to cancel or reschedule my appointment, I must provide 24 HS notice to avoid incurring a cancellation fee.",
    legal_p5: "Furthermore, I grant permission for Between Curves Massage to take photographs for promotional use, including but not limited to social media and marketing materials. I understand my identity may be associated with these images unless I explicitly request otherwise.",
    legal_final_agreement: "I confirm that I have read and fully understand this consent form. I agree to the terms outlined herein and acknowledge my willingness to proceed with the massage therapy services as described.",

    label_client_signature: "Client Signature",
    label_date: "Date",
    clear_signature: "Clear Signature",
    submit_btn_loading: "Processing Form...",
    submit_btn: "Sign & Submit Form",
};

// 2. Extraemos el TIPO exacto de ese objeto
export type TranslationType = typeof en;

// 3. Creamos el objeto en Español forzando que coincida con el TIPO de inglés
const es: TranslationType = {
    headerTitle: "Formulario de Admisión de Cliente",
    languageSelector: "Idioma / Language",
    switchLang: "Switch to English",

    personalInfoTitle: "INFORMACIÓN DEL CLIENTE",
    medicalHistoryTitle: "HISTORIAL MÉDICO",
    massageInfoTitle: "INFORMACIÓN DEL MASAJE",
    consentTitle: "CONSENTIMIENTO Y EXONERACIÓN",

    label_name: "Nombre Completo:",
    label_dob: "Fecha de Nacimiento:",
    label_age: "Edad:",
    label_gender: "Género:",
    label_address: "Dirección:",
    label_city: "Ciudad:",
    label_state: "Estado:",
    label_zip: "Código Postal:",
    label_phone: "Teléfono:",
    label_email: "Correo Electrónico:",
    label_emergency: "Contacto de Emergencia:",
    label_emailList: "¿Le gustaría ser añadido a nuestra lista de correos para noticias y ofertas exclusivas?",
    label_howHeard: "¿Cómo se enteró de nosotros?",

    medical_prompt_conditions: "¿Tiene alguna de las siguientes condiciones? (marque todas las que correspondan):",
    medical_prompt_other_issues: "¿Tiene algún otro problema médico no mencionado en este formulario?",
    medical_prompt_procedures: "¿Ha tenido procedimientos médicos o cirugías recientes?",
    medical_prompt_pregnant: "¿Está actualmente embarazada o amamantando? (Para clientes femeninas, si aplica).",
    medical_prompt_meds: "¿Está tomando algún medicamento actualmente?",
    label_if_yes_specify: "Si sí, por favor especifique:",
    label_other: "Otro:",

    massage_prompt_type: "¿Qué tipo de masaje le interesa? (Seleccione todos los que apliquen)",
    massage_prompt_areas: "¿Alguna área específica de tensión o dolor para tratar? (Seleccione todas las que apliquen)",
    massage_prompt_goals: "¿Cuáles son sus objetivos para esta sesión de masaje? (Seleccione todos los que apliquen)",
    massage_prompt_frequency: "¿Con qué frecuencia recibe masajes?",

    option_relaxation: "Relajación",
    option_swedish: "Sueco",
    option_therapeutic: "Terapéutico",
    option_hot_stone: "Piedras calientes",
    option_deep_tissue: "Tejido profundo",
    option_reflexology: "Reflexología",
    option_neck: "Cuello",
    option_shoulders: "Hombros",
    option_back: "Espalda",
    option_hips: "Caderas",
    option_legs: "Piernas",
    option_feet: "Pies",
    option_stress_reduction: "Reducción de estrés",
    option_pain_relief: "Alivio del dolor",
    option_injury_recovery: "Recuperación de lesiones",
    option_increased_flexibility: "Mayor flexibilidad",

    option_first_time: "Esta es mi primera vez",
    option_occasionally: "Ocasionalmente",
    option_regularly: "Regularmente",
    option_rarely: "Raramente",

    yes: "Sí",
    no: "No",

    legal_p1: "Yo, el abajo firmante, por la presente doy mi consentimiento para que Between Curves Massage realice servicios de terapia de masaje para mí. Entiendo que estos servicios incluirán una consulta previa a la cita y diversas técnicas de masaje para lograr mis resultados deseados.",
    legal_p2: "Reconozco que la terapia de masaje implica manipulación física que puede plantear ciertos riesgos, incluyendo dolor, moretones o reacciones alérgicas a aceites o lociones. Soy responsable de informar al terapeuta sobre cualquier condición médica, alergia o sensibilidad que pueda tener.",
    legal_p3: "Al firmar este formulario de consentimiento, libero a Between Curves Massage de cualquier responsabilidad por accidentes, lesiones o daños que puedan ocurrir durante los servicios de masaje proporcionados. Entiendo que, aunque se hará todo lo posible para garantizar una experiencia segura y satisfactoria, pueden surgir circunstancias imprevistas.",
    legal_p4: "Reconozco que si necesito cancelar o reprogramar mi cita, debo avisar con 24 horas de antelación para evitar incurrir en una tarifa de cancelación.",
    legal_p5: "Además, otorgo permiso a Between Curves Massage para tomar fotografías para uso promocional, incluyendo, pero no limitado a, redes sociales y materiales de marketing. Entiendo que mi identidad puede estar asociada con estas imágenes a menos que solicite explícitamente lo contrario.",
    legal_final_agreement: "Confirmo que he leído y comprendido completamente este formulario de consentimiento. Acepto los términos descritos aquí y reconozco mi voluntad de proceder con los servicios de terapia de masaje según lo descrito.",

    label_client_signature: "Firma del Cliente",
    label_date: "Fecha",
    clear_signature: "Borrar Firma",
    submit_btn_loading: "Procesando Formulario...",
    submit_btn: "Firmar y Enviar Formulario",
};

export const translations = { en, es };

// Mapping de condiciones (se mantiene igual)
export const conditionNamesMap: Record<string, string> = {
    acne: "Acne", active_infection: "Active infection", asthma: "Asthma", autoimmune_disease: "Autoimmune disease",
    bleeding_disorder: "Bleeding disorder", breathing_problems: "Breathing problems", diabetes: "Diabetes",
    easily_bruised: "Easily bruised", eczema: "Eczema", epilepsy: "Epilepsy", heart_disease: "Heart disease",
    herpes: "Herpes", hepatitis: "Hepatitis", hirsutism: "Hirsutism", hiv_aids: "HIV/AIDS",
    hyperpigmentation: "Hyperpigmentation", hypopigmentation: "Hypopigmentation", hysterectomy: "Hysterectomy",
    irregular_periods: "Irregular periods", keloid_scarring: "Keloid scarring", low_blood_pressure: "Low blood pressure",
    high_blood_pressure: "High blood pressure", lupus: "Lupus", menopause: "Menopause",
    polycystic_ovaries: "Polycystic ovaries", psoriasis: "Psoriasis", pregnant_breastfeeding: "Pregnant/breastfeeding",
    shingles: "Shingles", skin_diseases: "Skin diseases", thyroid_imbalance: "Thyroid imbalance",
    vitiligo: "Vitiligo", warts: "Warts"
};