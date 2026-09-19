import React, { createContext, useContext } from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { AestheticsFormData } from '@/app/aestheticsTypes';
import {
    AESTHETICS_CONSENT_VERSION, healthConditionLabels, microneedlingConfirmations,
    peelConfirmations, procedureLabels,
} from '@/lib/aestheticsConsent';
import { translateAesthetics } from '@/lib/aestheticsI18n';

const PdfTranslationContext = createContext<(value: string) => string>(value => value);
const usePdfTranslation = () => useContext(PdfTranslationContext);
const translateValue = (value: string | undefined, t: (value: string) => string) => value?.split(', ').map(part => t(part)).join(', ');

const c = { green: '#173E38', green2: '#28554D', cream: '#F6F1E7', paper: '#FFFEFB', gold: '#C3A064', goldSoft: '#F5EBD7', ink: '#273934', muted: '#65726D', line: '#DDD4C4' };
const s = StyleSheet.create({
    page: { paddingTop: 30, paddingHorizontal: 32, paddingBottom: 44, fontFamily: 'Helvetica', fontSize: 8, color: c.ink, backgroundColor: c.cream },
    coverImage: { width: '100%', height: 175, objectFit: 'cover', borderRadius: 14 },
    coverPanel: { marginTop: -48, marginHorizontal: 18, marginBottom: 18, padding: 18, borderRadius: 12, backgroundColor: c.green, color: '#FFF' },
    eyebrow: { color: '#DFC58E', fontSize: 6.5, fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase' },
    coverTitle: { marginTop: 6, fontSize: 22, fontWeight: 'bold', lineHeight: 1.05 },
    coverText: { marginTop: 7, color: '#DDE8E5', fontSize: 8, lineHeight: 1.4 },
    topBrand: { marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    brand: { color: c.green, fontSize: 11, fontWeight: 'bold' },
    version: { color: c.gold, fontSize: 6.5, fontWeight: 'bold' },
    section: { marginBottom: 11, padding: 13, borderRadius: 11, borderWidth: 1, borderColor: c.line, backgroundColor: c.paper },
    sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingBottom: 7, borderBottomWidth: 1, borderBottomColor: '#E8E1D5' },
    number: { width: 23, height: 23, marginRight: 8, borderRadius: 7, backgroundColor: c.green, color: '#E8CF9D', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 'bold' },
    title: { color: c.green, fontSize: 10.5, fontWeight: 'bold', letterSpacing: .4, textTransform: 'uppercase' },
    row: { flexDirection: 'row', marginHorizontal: -3 },
    field: { flex: 1, marginHorizontal: 3, marginBottom: 6, padding: 7, borderRadius: 6, backgroundColor: '#F8F6F1' },
    label: { marginBottom: 3, color: c.muted, fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase' },
    value: { fontSize: 8, lineHeight: 1.3 },
    question: { marginTop: 5, marginBottom: 3, color: c.green, fontSize: 7.3, fontWeight: 'bold', lineHeight: 1.35 },
    answer: { marginBottom: 6, padding: 7, borderRadius: 6, backgroundColor: '#F8F6F1', lineHeight: 1.35 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 },
    chip: { margin: 3, paddingVertical: 4, paddingHorizontal: 7, borderRadius: 8, backgroundColor: c.goldSoft, color: c.green, fontSize: 6.8 },
    conditionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: .5, borderBottomColor: '#E9E3D8' },
    conditionName: { width: '45%', fontWeight: 'bold' },
    conditionAnswer: { width: '12%', color: c.green, fontWeight: 'bold' },
    conditionDetails: { width: '43%', color: c.muted },
    legal: { marginBottom: 7, color: '#4C5A55', fontSize: 7.5, lineHeight: 1.5, textAlign: 'justify' },
    notice: { marginTop: 8, padding: 9, borderRadius: 7, backgroundColor: c.goldSoft, color: '#594925', lineHeight: 1.4 },
    accepted: { marginTop: 8, padding: 9, borderRadius: 7, backgroundColor: '#E9F2EF', color: c.green, fontWeight: 'bold', lineHeight: 1.4 },
    initialsRow: { flexDirection: 'row', marginBottom: 7, padding: 8, borderRadius: 7, backgroundColor: '#F8F6F1' },
    initials: { width: 48, marginRight: 8, color: c.gold, fontWeight: 'bold' },
    statement: { flex: 1, lineHeight: 1.4 },
    signatureCard: { marginTop: 10, padding: 12, borderRadius: 9, borderWidth: 1, borderColor: c.line, backgroundColor: '#FFF' },
    signature: { width: 165, height: 58, marginTop: 5, objectFit: 'contain', borderBottomWidth: 1, borderBottomColor: c.gold },
    signMeta: { marginTop: 6, color: c.muted, fontSize: 6.8 },
    footer: { position: 'absolute', left: 32, right: 32, bottom: 18, paddingTop: 7, borderTopWidth: 1, borderTopColor: '#D7CDBC', flexDirection: 'row', justifyContent: 'space-between', color: '#79817D', fontSize: 6.2 },
});

const dash = (value?: string) => value || '—';
const yesNo = (value: string) => value === 'yes' ? 'Sí' : value === 'no' ? 'No' : '—';
const list = (values: string[], other?: string) => [...values, ...(other ? [other] : [])];

function Header() { const t = usePdfTranslation(); return <View style={s.topBrand}><Text style={s.brand}>BETWEEN CURVES MASSAGE AND FACIALS</Text><Text style={s.version}>{t('EXPEDIENTE PRIVADO')} · V. {AESTHETICS_CONSENT_VERSION}</Text></View>; }
function Footer() { const t = usePdfTranslation(); return <View style={s.footer} fixed><Text>{t('FICHA DE CONSULTA Y CONSENTIMIENTO DE ESTÉTICA')}</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>; }
function Section({ number, title, children, wrap = true }: { number: string; title: string; children: React.ReactNode; wrap?: boolean }) { const t = usePdfTranslation(); return <View style={s.section} wrap={wrap}><View style={s.sectionHead}><View style={s.number}><Text>{number}</Text></View><Text style={s.title}>{t(title)}</Text></View>{children}</View>; }
function Field({ label, value }: { label: string; value?: string }) { const t = usePdfTranslation(); return <View style={s.field}><Text style={s.label}>{t(label)}</Text><Text style={s.value}>{dash(translateValue(value, t))}</Text></View>; }
function Answer({ label, value }: { label: string; value?: string }) { const t = usePdfTranslation(); return <><Text style={s.question}>{t(label)}</Text><Text style={s.answer}>{dash(translateValue(value, t))}</Text></>; }
function Chips({ values }: { values: string[] }) { const t = usePdfTranslation(); return <View style={s.grid}>{values.length ? values.map(value => <Text key={value} style={s.chip}>{t(value)}</Text>) : <Text style={s.answer}>—</Text>}</View>; }
function Signature({ label, image, name, date }: { label: string; image: string; name: string; date: string }) {
    const t = usePdfTranslation();
    return <View style={s.signatureCard} wrap={false}>
        <Text style={[s.title, { marginBottom: 3 }]}>{t(label)}</Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image does not support HTML alt */}
        {image ? <Image src={image} style={s.signature} /> : <Text style={s.answer}>{t('Sin firma')}</Text>}
        <Text style={s.signMeta}>{t('Nombre')}: {name}</Text>
        <Text style={s.signMeta}>{t('Fecha')}: {date}</Text>
    </View>;
}

export function AestheticsPdfTemplate({ data }: { data: AestheticsFormData }) {
    const t = (value: string) => translateAesthetics(data.language, value);
    const heroImage = typeof window === 'undefined' ? '/images/aesthetics-consent-hero.png' : `${window.location.origin}/images/aesthetics-consent-hero.png`;
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const signedAt = data.signedAt ? new Date(data.signedAt).toLocaleString('es-US', { dateStyle: 'long', timeStyle: 'short' }) : '';
    const services = data.selectedServices.map(value => value === 'facial' ? 'Facial personalizado' : value === 'microneedling' ? 'Microneedling' : 'Peeling químico');
    const pastProcedures = Object.entries(data.pastProcedures).filter(([, item]) => item.selected).map(([key, item]) => `${procedureLabels[key]}${item.details ? ` — ${item.details}` : ''}`);
    const conditions = Object.entries(healthConditionLabels);
    const generalLegal = [
        data.language === 'en' ? `I, ${fullName}, certify that the information provided in this form is true, accurate, and complete to the best of my knowledge.` : `Yo, ${fullName}, certifico que la información proporcionada en este formulario es verdadera, exacta y completa según mi conocimiento.`,
        "Comprendo que los servicios prestados por Between Curves Massage and Facials tienen fines estéticos y de cuidado de la piel y no sustituyen el diagnóstico, tratamiento o atención de un profesional médico autorizado.",
        "Confirmo haber informado sobre condiciones médicas, alergias, sensibilidades, medicamentos, productos tópicos, embarazo o lactancia y procedimientos recientes o programados que puedan afectar mi tratamiento. Me comprometo a informar cualquier cambio relevante antes de futuras sesiones.",
        "Comprendo que los resultados varían entre personas y pueden depender del estado de la piel, salud, estilo de vida, medicamentos, cuidados en casa, constancia y respuesta individual. Determinados procedimientos pueden producir efectos temporales como enrojecimiento, sensibilidad, sequedad, descamación, inflamación o irritación.",
        "Entiendo que el profesional podrá modificar, posponer o no realizar un procedimiento y recomendar evaluación médica cuando corresponda. He tenido la oportunidad de realizar preguntas y consiento voluntariamente recibir los servicios estéticos acordados.",
    ];

    return <PdfTranslationContext.Provider value={t}><Document title={`${t('Expediente estético')} — ${fullName}`} author="Between Curves Massage and Facials">
        <Page size="A4" style={s.page} wrap>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image does not support HTML alt */}
            <Image src={heroImage} style={s.coverImage} />
            <View style={s.coverPanel}><Text style={s.eyebrow}>BETWEEN CURVES MASSAGE AND FACIALS</Text><Text style={s.coverTitle}>{t('Ficha de consulta y consentimiento de estética')}</Text><Text style={s.coverText}>{t('Evaluación personalizada de la piel, antecedentes, preferencias y autorizaciones del tratamiento.')}</Text></View>
            <Section number="01" title="Información del cliente" wrap={false}><View style={s.row}><Field label="Nombre completo" value={fullName} /><Field label="Fecha de nacimiento" value={data.dob} /></View><View style={s.row}><Field label="Teléfono" value={data.phone} /><Field label="Email" value={data.email} /></View><View style={s.row}><Field label="Contacto de emergencia" value={data.emergencyName} /><Field label="Teléfono de emergencia" value={data.emergencyPhone} /></View><View style={s.row}><Field label="Profesional" value={data.professionalName} /></View><Text style={s.question}>Servicios seleccionados</Text><Chips values={services} /></Section>
            <Section number="02" title="Expectativas y antecedentes de la piel"><Answer label="1. ¿Qué te gustaría mejorar?" value={list(data.skinGoals, data.otherSkinGoal).join(', ')} /><View style={s.row}><Field label="2. Faciales anteriores" value={yesNo(data.priorFacials)} /><Field label="¿Cuáles?" value={data.priorFacialsDetails} /></View><Answer label="3. Tipo de piel" value={data.skinType} /><Answer label="4. Reacción al sol sin protector" value={data.sunReaction} /><Answer label="Para uso profesional · Fototipo Fitzpatrick" value={data.fitzpatrick} /><Answer label="5. Síntomas frecuentes" value={data.skinSymptoms.join(', ')} /><Answer label="6. Reacción después de lesión" value={data.healingReaction} /><View style={s.row}><Field label="7. Moretones fácilmente" value={yesNo(data.bruisesEasily)} /><Field label="8. Herpes o lesiones recurrentes" value={yesNo(data.recurringLesions)} /></View><Answer label="Explicación" value={data.recurringLesionsDetails} /></Section>
            <Footer />
        </Page>

        <Page size="A4" style={s.page} wrap><Header />
            <Section number="03" title="Rutina actual y exposición solar"><Answer label="9. Productos utilizados en casa" value={list(data.homeProducts, data.otherHomeProduct).join(', ')} /><View style={s.row}><Field label="10. Evaluación de rutina" value={yesNo(data.routineReview)} /><Field label="11. Disposición a cambios" value={data.routineChanges} /></View><View style={s.row}><Field label="12. Exposición frecuente al sol" value={yesNo(data.sunExposure)} /><Field label="13. Uso diario de protector" value={data.sunscreenUse} /></View><View style={s.row}><Field label="14. Camas de bronceado" value={yesNo(data.tanningBeds)} /><Field label="Frecuencia" value={data.tanningFrequency} /></View></Section>
            <Section number="04" title="Procedimientos, medicamentos y tratamientos"><Answer label="15. Procedimientos anteriores y fecha" value={pastProcedures.join('; ')} /><Answer label="16. Procedimientos programados" value={list(data.plannedProcedures, data.otherPlannedProcedure).join(', ')} /><Answer label="Fecha prevista" value={data.plannedDate} /><View style={s.row}><Field label="17. Tratamiento dermatológico" value={yesNo(data.dermatologistCare)} /><Field label="Detalle" value={data.dermatologistDetails} /></View><Answer label="18. Medicamentos, vitaminas, suplementos o terapia hormonal" value={data.medications} /><Answer label="19. Medicamentos y activos de la piel" value={data.skinMedications.join(', ')} /><Answer label="Cuál y último uso" value={data.skinMedicationDetails} /></Section>
            <Section number="05" title="Historial de salud"><View><View style={[s.conditionRow, { backgroundColor: c.green, color: '#FFF', paddingHorizontal: 5 }]}><Text style={s.conditionName}>{t('Condición')}</Text><Text style={s.conditionAnswer}>{t('Sí/No')}</Text><Text style={s.conditionDetails}>{t('Información adicional')}</Text></View>{conditions.map(([key, label]) => { const item = data.healthConditions[key]; return <View key={key} style={s.conditionRow}><Text style={s.conditionName}>{t(label)}</Text><Text style={s.conditionAnswer}>{t(yesNo(item?.answer || ''))}</Text><Text style={s.conditionDetails}>{item?.details || '—'}</Text></View>; })}</View><Answer label="Presión arterial" value={data.bloodPressure} /><View style={s.row}><Field label="21. Otra condición o cirugía" value={yesNo(data.otherMedical)} /><Field label="Explicación" value={data.otherMedicalDetails} /></View><Answer label="22. Reacciones o sensibilidades" value={list(data.reactions, data.otherReaction).join(', ')} /><Answer label="Explicación" value={data.reactionDetails} /></Section><Footer />
        </Page>

        <Page size="A4" style={s.page} wrap><Header />
            <Section number="06" title="Preferencias, comodidad y estilo de vida"><Answer label="23. Sensibilidad a aromas" value={`${data.fragrancePreference}${data.fragranceDetails ? ` — ${data.fragranceDetails}` : ''}`} /><Answer label="24. Comodidad con aromas ambientales" value={yesNo(data.ambientAromas)} /><Answer label="25. Para mujeres" value={data.womenHealth.join(', ')} /><Answer label="26. Método de afeitado" value={`${data.shavingMethod}${data.otherShavingMethod ? ` — ${data.otherShavingMethod}` : ''}`} /><Answer label="27. Síntomas después del afeitado" value={data.maleSkinSymptoms.join(', ')} /><View style={s.row}><Field label="28. Estrés" value={data.stressLevel} /><Field label="29. Sueño" value={data.sleepsWell} /><Field label="30. Actividad física" value={yesNo(data.physicalActivity)} /></View><View style={s.row}><Field label="31. Hidratación" value={data.hydration} /><Field label="32. Alergia alimentaria" value={yesNo(data.foodAllergy)} /><Field label="Cuál" value={data.foodAllergyDetails} /></View></Section>
            <Section number="07" title="Objetivos, fotografías y comunicaciones"><Answer label="33. Disposición a un programa de varias sesiones" value={data.treatmentProgram} /><View style={s.row}><Field label="34. Fotos de expediente y seguimiento" value={yesNo(data.clinicalPhotos)} /><Field label="35. Fotos/videos promocionales" value={yesNo(data.marketingMedia)} /></View><Answer label="Alcance autorizado para publicación" value={data.mediaVisibility.join(', ')} /><View style={s.row}><Field label="36. Promociones y descuentos" value={yesNo(data.promotions)} /><Field label="Canales preferidos" value={data.promotionChannels.join(', ')} /></View><Text style={s.notice}>Las autorizaciones promocionales son voluntarias y no condicionan los servicios. El cliente puede solicitar dejar de recibir comunicaciones.</Text></Section>
            <Section number="08" title="Consentimiento informado general">{generalLegal.map(text => <Text key={text} style={s.legal}>{t(text)}</Text>)}<Text style={s.accepted}>✓ {t('He leído, comprendo y acepto voluntariamente el consentimiento informado general.')}</Text><Signature label="Firma digital del cliente" image={data.clientSignature} name={fullName} date={signedAt} /><View style={s.signatureCard}><Text style={s.title}>{t('FIRMA DEL PROFESIONAL')}</Text><Text style={s.signMeta}>{t('Nombre')}: {dash(data.professionalName)}</Text><Text style={s.signMeta}>{t('Firma')}: ______________________________________________</Text><Text style={s.signMeta}>{t('Fecha')}: ______________________________________________</Text></View></Section><Footer />
        </Page>

        {data.selectedServices.includes('microneedling') && <Page size="A4" style={s.page} wrap><Header /><Section number="A" title="Consentimiento específico para microneedling"><Text style={s.legal}>{t('Entiendo que el microneedling utiliza microagujas para crear microcanales controlados en la piel, estimulando los procesos naturales de reparación y producción de colágeno. Puede utilizarse para mejorar textura irregular, cicatrices de acné, líneas finas, poros y manchas. Los resultados varían y pueden recomendarse varias sesiones; no se garantiza un resultado específico.')}</Text><Text style={[s.title, { marginVertical: 8 }]}>{t('CONFIRMACIÓN')}</Text>{microneedlingConfirmations.map((text, index) => <View key={text} style={s.initialsRow}><Text style={s.initials}>{t('Iniciales')}: {dash(data.microInitials[index])}</Text><Text style={s.statement}>{t(text)}</Text></View>)}<Text style={[s.title, { marginVertical: 8 }]}>{t('CONTRAINDICACIONES Y PRECAUCIONES')}</Text><Chips values={data.microContraindications} /><Answer label="Detalle y fecha" value={data.microContraindicationDetails} /><Text style={s.notice}>{t('Seleccionar una opción no determina automáticamente si el procedimiento puede realizarse. La información será evaluada y el procedimiento podrá modificarse, posponerse o requerir evaluación médica.')}</Text><Text style={[s.title, { marginVertical: 8 }]}>{t('PIGMENTACIÓN, CICATRIZACIÓN Y CUIDADOS')}</Text>{[
                [data.microPigmentationInitials, "Entiendo que pueden producirse cambios de pigmentación, incluyendo hiperpigmentación postinflamatoria."],
                [data.microScarringInitials, "Entiendo que existe un riesgo poco frecuente de cicatrización anormal, incluyendo cicatrices hipertróficas o queloides."],
                [data.microAftercareInitials, "Me comprometo a seguir la preparación y cuidados posteriores, usar protección solar y no manipular descamación o costras."],
            ].map(([initials, text]) => <View key={text} style={s.initialsRow}><Text style={s.initials}>{t('Iniciales')}: {dash(initials)}</Text><Text style={s.statement}>{t(text)}</Text></View>)}<Text style={s.accepted}>✓ {t('He leído, comprendo y consiento voluntariamente recibir el procedimiento de microneedling.')}</Text><Signature label="Firma digital — Microneedling" image={data.microSignature} name={fullName} date={signedAt} /></Section><Footer /></Page>}

        {data.selectedServices.includes('peel') && <Page size="A4" style={s.page} wrap><Header /><Section number="B" title="Consentimiento específico para peeling químico"><Text style={s.legal}>{t('Entiendo que un peeling químico consiste en la aplicación profesional y controlada de una solución química para producir una exfoliación de profundidad variable y favorecer la renovación cutánea. El profesional seleccionará el tipo y protocolo que considere más adecuado y seguro según mi piel, objetivos, antecedentes y tolerancia.')}</Text><Text style={[s.title, { marginVertical: 8 }]}>{t('CONFIRMACIÓN DEL CLIENTE')}</Text>{peelConfirmations.map((text, index) => <View key={text} style={s.initialsRow}><Text style={s.initials}>{t('Iniciales')}: {dash(data.peelInitials[index])}</Text><Text style={s.statement}>{t(text)}</Text></View>)}<Text style={[s.title, { marginVertical: 8 }]}>{t('CONTRAINDICACIONES Y PRECAUCIONES')}</Text><Chips values={data.peelContraindications} /><Answer label="Detalles y fecha aproximada" value={data.peelContraindicationDetails} /><Text style={s.notice}>{t('El profesional determinará si corresponde realizar, modificar, sustituir o posponer el tratamiento.')}</Text><Text style={[s.title, { marginVertical: 8 }]}>{t('ALERGIAS, SOL Y CUIDADOS POSTERIORES')}</Text>{[
                [data.peelAllergyInitials, "Confirmo haber informado todas mis alergias y sensibilidades conocidas, incluyendo medicamentos e ingredientes."],
                [data.peelSunInitials, "Entiendo que debo evitar exposición solar excesiva y camas de bronceado durante el período indicado."],
                [data.peelSunscreenInitials, "Entiendo la importancia de utilizar diariamente protector solar de amplio espectro."],
                [data.peelAftercareInitials, "Me comprometo a seguir los cuidados posteriores, evitar productos irritantes y no retirar piel descamada o costras."],
                [data.peelReactionInitials, "Entiendo que debo comunicar cualquier reacción inesperada y buscar atención médica cuando corresponda."],
            ].map(([initials, text]) => <View key={text} style={s.initialsRow}><Text style={s.initials}>{t('Iniciales')}: {dash(initials)}</Text><Text style={s.statement}>{t(text)}</Text></View>)}<Text style={s.accepted}>✓ {t('He leído, comprendo y consiento voluntariamente recibir el peeling químico seleccionado para mi piel.')}</Text><Signature label="Firma digital — Peeling químico" image={data.peelSignature} name={fullName} date={signedAt} /></Section><Footer /></Page>}
    </Document></PdfTranslationContext.Provider>;
}
