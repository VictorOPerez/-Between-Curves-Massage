export const AESTHETICS_CONSENT_VERSION = "2026-09-19";

export const skinGoals = [
    "Acné", "Cicatrices de acné", "Manchas / hiperpigmentación", "Manchas causadas por el sol o la edad",
    "Poros dilatados", "Textura irregular", "Líneas de expresión / arrugas", "Capilares visibles",
    "Cicatrices", "Estrías",
];

export const skinTypes = ["Normal", "Seca", "Grasa", "Mixta", "Sensible", "Dañada por el sol", "No estoy seguro/a"];

export const sunReactions = [
    "Siempre se quema y prácticamente nunca se broncea.",
    "Se quema fácilmente y se broncea muy poco.",
    "A veces se quema y después se broncea gradualmente.",
    "Rara vez se quema y se broncea fácilmente.",
    "Casi nunca se quema y adquiere un bronceado intenso.",
    "Nunca se quema y mi piel es naturalmente muy pigmentada.",
    "No estoy seguro/a.",
];

export const skinSymptoms = ["Descamación", "Tirantez", "Enrojecimiento", "Ardor o sensibilidad", "Exceso de grasa/brillo", "Brotes frecuentes", "Ninguno"];
export const homeProducts = ["Limpiador", "Hidratante", "Protector solar", "Vitamina C", "Retinol / retinoides", "Ácidos o exfoliantes", "Productos para el acné", "Productos para manchas/despigmentantes", "Medicamentos tópicos", "Actualmente no utilizo productos"];

export const procedureLabels: Record<string, string> = {
    botox: "Botox / toxina botulínica",
    fillers: "Fillers / rellenos dérmicos",
    laser: "Láser o IPL facial",
    laserHair: "Depilación láser facial",
    peel: "Peeling químico",
    microneedling: "Microneedling",
    microdermabrasion: "Microdermoabrasión",
    surgery: "Cirugía facial o estética",
    other: "Otro procedimiento facial",
};

export const skinMedications = ["Isotretinoína / Accutane", "Tretinoína / Retin-A", "Adapaleno / Differin", "Tazaroteno / Tazorac", "Hidroquinona", "Antibióticos tópicos u orales", "AHA/BHA/PHA u otros ácidos", "Otro medicamento para la piel", "Ninguno"];

export const healthConditionLabels: Record<string, string> = {
    acne: "Acné",
    allergies: "Alergias",
    cancer: "Cáncer / antecedentes de cáncer",
    diabetes: "Diabetes",
    eczema: "Eczema / dermatitis",
    epilepsy: "Epilepsia / convulsiones",
    heart: "Enfermedad cardíaca",
    hepatitis: "Hepatitis",
    infection: "Infección activa",
    autoimmune: "Lupus / enfermedad autoinmune",
    metalImplants: "Implantes metálicos",
    pacemaker: "Marcapasos / dispositivo electrónico implantado",
    recentInjury: "Lesión o cirugía reciente",
    thyroid: "Problemas de tiroides",
    circulation: "Varices / problemas circulatorios",
    claustrophobia: "Claustrofobia",
    smoking: "¿Fuma?",
    contacts: "¿Utiliza lentes de contacto?",
};

export const reactionTypes = ["Cosméticos", "Medicamentos", "Metales", "Alimentos", "Fragancias", "Látex", "Ninguna conocida"];
export const womenOptions = ["Estoy embarazada o existe posibilidad de embarazo", "Estoy intentando quedar embarazada", "Estoy lactando", "Utilizo anticonceptivos hormonales", "Recibo terapia de reemplazo hormonal", "Tengo un desequilibrio hormonal conocido", "Ninguna de las anteriores"];
export const maleSymptoms = ["Vellos encarnados", "Irritación después del afeitado", "Brotes", "Ninguno"];

export const microneedlingConfirmations = [
    "Confirmo que toda la información de salud, medicamentos, alergias, productos de skincare y procedimientos estéticos proporcionada anteriormente es correcta y está actualizada.",
    "Entiendo que después del procedimiento puedo experimentar temporalmente enrojecimiento, sensibilidad, ardor, tirantez, inflamación, pequeños puntos de sangrado, sequedad, descamación o formación superficial de costras.",
    "Entiendo que, aunque son menos frecuentes, existen riesgos como infección, reacción o sensibilidad a productos utilizados, cambios de pigmentación, cicatrización prolongada, resultados desiguales o formación de cicatrices.",
    "Entiendo que existe la posibilidad de obtener una mejoría menor a la esperada o no obtener el resultado deseado.",
    "Acepto seguir las instrucciones de preparación y cuidados posteriores proporcionadas por el profesional y comunicar cualquier reacción inesperada o preocupante.",
];

export const microneedlingContraindications = [
    "Acné inflamatorio severo o lesiones activas en el área", "Infección cutánea activa", "Heridas abiertas, quemaduras o irritación significativa",
    "Brote activo de herpes simple", "Antecedentes de cicatrices queloides o hipertróficas", "Tendencia importante a desarrollar manchas después de una lesión o inflamación",
    "Diabetes no controlada", "Trastorno autoinmune", "Problemas de coagulación o medicamentos que afecten la coagulación",
    "Quimioterapia o radioterapia actual/reciente", "Uso actual o reciente de isotretinoína/Accutane", "Peeling químico reciente",
    "Láser, IPL o depilación láser reciente en el área", "Cirugía o procedimiento invasivo reciente en el área", "Embarazo o lactancia",
    "Alergia/sensibilidad conocida a algún producto o anestésico que pudiera utilizarse", "Otra condición que pueda afectar la cicatrización", "Ninguna de las anteriores",
];

export const peelConfirmations = [
    "Confirmo que la información proporcionada sobre mi salud, medicamentos, alergias, embarazo/lactancia, productos de skincare, exposición solar y procedimientos recientes es correcta y está actualizada.",
    "Entiendo que después del peeling puedo experimentar temporalmente enrojecimiento, sensibilidad, tirantez, sequedad, picor o ardor, oscurecimiento temporal y descamación.",
    "Entiendo que no todos los peelings producen descamación visible y que no presentar descamación no significa que el tratamiento no haya actuado.",
    "Entiendo que pueden producirse reacciones adversas menos frecuentes como irritación intensa, inflamación, ampollas, quemadura química, infección, cambios de pigmentación o cicatrización anormal.",
    "Entiendo que los resultados varían, no se garantiza un resultado específico y pueden recomendarse varias sesiones y cuidados adecuados en casa.",
];

export const peelContraindications = [
    "Quemadura solar o exposición solar intensa reciente", "Piel irritada, lesionada o extremadamente sensibilizada", "Heridas abiertas en el área a tratar",
    "Infección cutánea activa", "Brote activo de herpes simple/herpes labial", "Acné severamente inflamado o lesiones abiertas",
    "Depilación con cera reciente en el área", "Uso reciente de cremas depilatorias en el área", "Láser, IPL o depilación láser reciente",
    "Microneedling reciente", "Otro peeling químico reciente", "Cirugía o procedimiento facial reciente",
    "Uso actual o reciente de isotretinoína/Accutane", "Uso reciente de retinoides", "Uso reciente de AHA, BHA, PHA u otros exfoliantes",
    "Tendencia a desarrollar hiperpigmentación después de irritaciones", "Antecedentes de cicatrices queloides o hipertróficas",
    "Alergia o sensibilidad conocida a algún ingrediente del tratamiento", "Embarazo o lactancia", "Otra condición que pueda afectar la seguridad o cicatrización", "Ninguna de las anteriores",
];
