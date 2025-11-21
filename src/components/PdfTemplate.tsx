// app/components/PdfTemplate.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { IntakeFormData } from '../app/types';
import { translations, conditionNamesMap } from '../app/locales';

// Registramos una fuente estándar para asegurar que se vea bien
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Oblique.ttf', fontStyle: 'italic' }
    ]
});

interface PdfTemplateProps {
    data: IntakeFormData;
    signatureUrl: string;
    lang: 'en' | 'es'; // El PDF también necesita saber el idioma
}

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica', color: '#333' },
    // Header estilo "Between Curves"
    headerContainer: { alignItems: 'center', marginBottom: 20 },
    companyTitle: { fontSize: 18, fontWeight: 'bold', color: '#A6812A', textTransform: 'uppercase' }, // Dorado oscuro
    subTitle: { fontSize: 12, fontStyle: 'italic', marginTop: 5, color: '#666' },

    section: { marginVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#A6812A', textTransform: 'uppercase' },

    row: { flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' },
    label: { width: 110, fontWeight: 'bold', color: '#555' },
    value: { flex: 1 },

    promptText: { fontWeight: 'bold', marginTop: 5, marginBottom: 3 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
    gridItem: { width: '33%', marginBottom: 2, flexDirection: 'row' },
    checkboxMarker: { width: 10, height: 10, borderWidth: 1, borderColor: '#333', marginRight: 4, alignItems: 'center', justifyContent: 'center', fontSize: 8 },
    checked: { backgroundColor: '#A6812A' },

    legalParagraph: { fontSize: 8, textAlign: 'justify', marginBottom: 6, lineHeight: 1.3 },
    signatureBlock: { marginTop: 20, alignItems: 'flex-start' },
    signatureImage: { width: 150, height: 60, borderBottomWidth: 1, borderBottomColor: '#000' }
});

// Helper para mostrar checkboxes en el PDF
const CheckboxItem = ({ label, isChecked }: { label: string, isChecked: boolean }) => (
    <View style={styles.gridItem}>
        <View style={[styles.checkboxMarker, isChecked ? styles.checked : {}]}>
            {isChecked ? <Text style={{ color: 'white' }}>X</Text> : null}
        </View>
        <Text>{label}</Text>
    </View>
);

export const PdfTemplate: React.FC<PdfTemplateProps> = ({ data, signatureUrl, lang }) => {
    const t = translations[lang];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <Text style={styles.companyTitle}>BETWEEN CURVES MASSAGE</Text>
                    <Text style={styles.subTitle}>{t.headerTitle}</Text>
                </View>

                {/* 1. CLIENT INFORMATION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.personalInfoTitle}</Text>
                    <View style={styles.row}><Text style={styles.label}>{t.label_name}</Text><Text style={styles.value}>{data.name}</Text></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.row}><Text style={styles.label}>{t.label_dob}</Text><Text style={{ width: 80 }}>{data.dob}</Text></View>
                        <View style={styles.row}><Text style={{ fontWeight: 'bold', marginRight: 5 }}>{t.label_age}</Text><Text style={{ width: 40 }}>{data.age}</Text></View>
                        <View style={styles.row}><Text style={{ fontWeight: 'bold', marginRight: 5 }}>{t.label_gender}</Text><Text style={{ width: 60 }}>{data.gender}</Text></View>
                    </View>
                    <View style={styles.row}><Text style={styles.label}>{t.label_address}</Text><Text style={styles.value}>{data.address}</Text></View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.row}><Text style={styles.label}>{t.label_city}</Text><Text style={{ width: 100 }}>{data.city}</Text></View>
                        <View style={styles.row}><Text style={{ fontWeight: 'bold', marginRight: 5, marginLeft: 10 }}>{t.label_state}</Text><Text style={{ width: 40 }}>{data.state}</Text></View>
                        <View style={styles.row}><Text style={{ fontWeight: 'bold', marginRight: 5, marginLeft: 10 }}>{t.label_zip}</Text><Text style={{ width: 60 }}>{data.zip}</Text></View>
                    </View>
                    <View style={styles.row}><Text style={styles.label}>{t.label_phone}</Text><Text style={styles.value}>{data.phone}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>{t.label_email}</Text><Text style={styles.value}>{data.email}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>{t.label_emergency}</Text><Text style={styles.value}>{data.emergencyContact}</Text></View>

                    <View style={[styles.row, { marginTop: 5 }]}>
                        <Text style={{ flex: 1 }}>{t.label_emailList}</Text>
                        <Text style={{ fontWeight: 'bold' }}>{data.addedToEmailList === true ? t.yes : (data.addedToEmailList === false ? t.no : '')}</Text>
                    </View>
                    <View style={styles.row}><Text style={styles.label}>{t.label_howHeard}</Text><Text style={styles.value}>{data.howDidYouHear}</Text></View>
                </View>

                {/* 2. MEDICAL HISTORY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.medicalHistoryTitle}</Text>
                    <Text style={styles.promptText}>{t.medical_prompt_conditions}</Text>
                    <View style={styles.grid}>
                        {Object.entries(data.conditions).map(([key, isChecked]) => {
                            if (key === 'other_conditions') return null; // Skip text field here
                            // Use the mapping for English names, or fallback to key format
                            const labelStr = conditionNamesMap[key] || key.replace(/_/g, ' ');
                            return <CheckboxItem key={key} label={labelStr} isChecked={isChecked as boolean} />
                        })}
                    </View>
                    {data.conditions.other_conditions && (
                        <View style={styles.row}><Text style={styles.label}>{t.label_other}</Text><Text style={styles.value}>{data.conditions.other_conditions}</Text></View>
                    )}

                    {/* Additional Medical Questions */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.promptText}>{t.medical_prompt_other_issues}</Text>
                        <Text style={{ marginLeft: 10 }}>{data.otherMedicalIssues || t.no}</Text>

                        <Text style={styles.promptText}>{t.medical_prompt_procedures}</Text>
                        <Text style={{ marginLeft: 10 }}>{data.recentProcedures || t.no}</Text>

                        <Text style={styles.promptText}>{t.medical_prompt_pregnant}</Text>
                        <Text style={{ marginLeft: 10 }}>{data.currentlyPregnant === true ? t.yes : (data.currentlyPregnant === false ? t.no : '')}</Text>

                        <Text style={styles.promptText}>{t.medical_prompt_meds}</Text>
                        <Text style={{ marginLeft: 10 }}>{data.currentMedications || t.no}</Text>
                    </View>
                </View>

                {/* 3. MASSAGE INFORMATION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.massageInfoTitle}</Text>

                    <Text style={styles.promptText}>{t.massage_prompt_type}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_relaxation} isChecked={data.massageTypeOfInterest.relaxation} />
                        <CheckboxItem label={t.option_swedish} isChecked={data.massageTypeOfInterest.swedish} />
                        <CheckboxItem label={t.option_therapeutic} isChecked={data.massageTypeOfInterest.therapeutic} />
                        <CheckboxItem label={t.option_hot_stone} isChecked={data.massageTypeOfInterest.hot_stone} />
                        <CheckboxItem label={t.option_deep_tissue} isChecked={data.massageTypeOfInterest.deep_tissue} />
                        <CheckboxItem label={t.option_reflexology} isChecked={data.massageTypeOfInterest.reflexology} />
                    </View>
                    {data.massageTypeOfInterest.other_type && <View style={styles.row}><Text style={styles.label}>{t.label_other}</Text><Text style={styles.value}>{data.massageTypeOfInterest.other_type}</Text></View>}

                    <Text style={styles.promptText}>{t.massage_prompt_areas}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_neck} isChecked={data.areasOfTension.neck} />
                        <CheckboxItem label={t.option_shoulders} isChecked={data.areasOfTension.shoulders} />
                        <CheckboxItem label={t.option_back} isChecked={data.areasOfTension.back} />
                        <CheckboxItem label={t.option_hips} isChecked={data.areasOfTension.hips} />
                        <CheckboxItem label={t.option_legs} isChecked={data.areasOfTension.legs} />
                        <CheckboxItem label={t.option_feet} isChecked={data.areasOfTension.feet} />
                    </View>
                    {data.areasOfTension.other_area && <View style={styles.row}><Text style={styles.label}>{t.label_other}</Text><Text style={styles.value}>{data.areasOfTension.other_area}</Text></View>}

                    <Text style={styles.promptText}>{t.massage_prompt_goals}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_relaxation} isChecked={data.massageGoals.relaxation} />
                        <CheckboxItem label={t.option_stress_reduction} isChecked={data.massageGoals.stress_reduction} />
                        <CheckboxItem label={t.option_pain_relief} isChecked={data.massageGoals.pain_relief} />
                        <CheckboxItem label={t.option_injury_recovery} isChecked={data.massageGoals.injury_recovery} />
                        <CheckboxItem label={t.option_increased_flexibility} isChecked={data.massageGoals.increased_flexibility} />
                    </View>
                    {data.massageGoals.other_goal && <View style={styles.row}><Text style={styles.label}>{t.label_other}</Text><Text style={styles.value}>{data.massageGoals.other_goal}</Text></View>}

                    <Text style={styles.promptText}>{t.massage_prompt_frequency}</Text>
                    <Text style={{ marginLeft: 10 }}>{data.massageFrequency ? t[`option_${data.massageFrequency}` as keyof typeof t] : ''}</Text>
                </View>

                {/* 4. LEGAL CONSENT (Full Text) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.consentTitle}</Text>
                    <Text style={styles.legalParagraph}>{t.legal_p1}</Text>
                    <Text style={styles.legalParagraph}>{t.legal_p2}</Text>
                    <Text style={styles.legalParagraph}>{t.legal_p3}</Text>
                    <Text style={styles.legalParagraph}>{t.legal_p4}</Text>
                    <Text style={styles.legalParagraph}>{t.legal_p5}</Text>
                    <Text style={[styles.legalParagraph, { fontWeight: 'bold', marginTop: 5 }]}>{t.legal_final_agreement}</Text>
                </View>

                {/* Firma */}
                <View style={styles.signatureBlock}>
                    <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>{t.label_client_signature}</Text>
                    {signatureUrl && <Image src={signatureUrl} style={styles.signatureImage} />}
                    <Text style={{ marginTop: 5 }}>{t.label_date}: {new Date().toLocaleDateString()}</Text>
                    <Text style={{ marginTop: 2 }}>Printed Name: {data.name}</Text>
                </View>
            </Page>
        </Document>
    );
};