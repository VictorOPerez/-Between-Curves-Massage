import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { IntakeFormData } from '../app/types';
import { conditionNamesMaps, translations } from '../app/locales';
import { CONSENT_VERSION } from '../lib/consentConstants';

interface PdfTemplateProps {
    data: IntakeFormData;
    signatureUrl: string;
    lang: 'en' | 'es';
}

const colors = {
    green: '#173E38',
    greenSoft: '#EAF2EF',
    gold: '#C3A064',
    goldSoft: '#F6EEDC',
    cream: '#F7F3EA',
    paper: '#FFFEFB',
    ink: '#263934',
    muted: '#68736F',
    line: '#DED7C9',
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 28,
        paddingHorizontal: 30,
        paddingBottom: 42,
        fontSize: 8.5,
        fontFamily: 'Helvetica',
        color: colors.ink,
        backgroundColor: colors.cream,
    },
    hero: {
        padding: 22,
        marginBottom: 14,
        borderRadius: 14,
        backgroundColor: colors.green,
        color: '#FFFFFF',
    },
    brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
    monogram: {
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#7E806B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    monogramText: { color: '#E4C993', fontWeight: 'bold', fontSize: 12 },
    companyTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 0.4 },
    companyTagline: { marginTop: 3, color: '#D9C18F', fontSize: 6.5, letterSpacing: 1.3, textTransform: 'uppercase' },
    documentEyebrow: { color: '#E1C58E', fontSize: 7, fontWeight: 'bold', letterSpacing: 1.6, textTransform: 'uppercase' },
    documentTitle: { marginTop: 7, fontSize: 25, fontWeight: 'bold', lineHeight: 1.05 },
    documentIntro: { marginTop: 8, maxWidth: 390, color: '#DDE8E5', fontSize: 8.5, lineHeight: 1.45 },
    metaRow: { flexDirection: 'row', marginTop: 16 },
    metaPill: {
        marginRight: 7,
        paddingVertical: 5,
        paddingHorizontal: 9,
        borderRadius: 10,
        backgroundColor: '#284D47',
        color: '#ECF3F1',
        fontSize: 6.5,
    },
    section: {
        marginBottom: 11,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.paper,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 11, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#EAE4D9' },
    sectionNumber: {
        width: 24,
        height: 24,
        marginRight: 9,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.green,
        color: '#E4C993',
        fontSize: 7,
        fontWeight: 'bold',
    },
    sectionTitle: { color: colors.green, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase' },
    row: { flexDirection: 'row', marginHorizontal: -4 },
    field: { flex: 1, marginHorizontal: 4, marginBottom: 7, padding: 7, borderRadius: 7, backgroundColor: '#F9F7F2' },
    fieldLabel: { marginBottom: 3, color: colors.muted, fontSize: 6.4, fontWeight: 'bold', textTransform: 'uppercase' },
    fieldValue: { color: colors.ink, fontSize: 8.5 },
    prompt: { marginTop: 4, marginBottom: 6, color: colors.green, fontWeight: 'bold', lineHeight: 1.35 },
    answerBox: { marginBottom: 7, padding: 7, borderRadius: 7, backgroundColor: '#F9F7F2', color: colors.ink },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 },
    gridItem: { width: '33.33%', paddingHorizontal: 3, marginBottom: 5, flexDirection: 'row', alignItems: 'center' },
    checkbox: { width: 10, height: 10, marginRight: 5, borderRadius: 3, borderWidth: 1, borderColor: '#A89B83', alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { borderColor: colors.green, backgroundColor: colors.green },
    checkboxX: { color: '#FFFFFF', fontSize: 6, fontWeight: 'bold' },
    legalPanel: { padding: 12, borderRadius: 9, backgroundColor: '#F8F6F1' },
    legalParagraph: { marginBottom: 7, color: '#4E5B57', fontSize: 7.5, lineHeight: 1.45, textAlign: 'justify' },
    acceptance: { marginTop: 8, padding: 9, borderRadius: 8, backgroundColor: colors.greenSoft, color: colors.green, fontWeight: 'bold', lineHeight: 1.35 },
    photoPanel: { marginTop: 10, padding: 11, borderRadius: 9, borderWidth: 1, borderColor: '#DEC99F', backgroundColor: colors.goldSoft },
    choice: { marginTop: 7, alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 11, borderRadius: 10, backgroundColor: colors.green, color: '#FFFFFF', fontWeight: 'bold' },
    signatureCard: { marginTop: 10, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FFFFFF' },
    signatureLabel: { color: colors.green, fontSize: 9, fontWeight: 'bold' },
    signatureImage: { width: 170, height: 62, marginTop: 6, objectFit: 'contain', borderBottomWidth: 1, borderBottomColor: colors.gold },
    signatureMeta: { marginTop: 7, color: colors.muted, fontSize: 7 },
    footer: { position: 'absolute', left: 30, right: 30, bottom: 18, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#D8D0C1', paddingTop: 7, color: '#7B827F', fontSize: 6.5 },
});

function SectionHeader({ number, title }: { number: string; title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}><Text>{number}</Text></View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

function Field({ label, value }: { label: string; value?: string }) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value || '—'}</Text>
        </View>
    );
}

function CheckboxItem({ label, checked }: { label: string; checked: boolean }) {
    return (
        <View style={styles.gridItem}>
            <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
                {checked && <Text style={styles.checkboxX}>✓</Text>}
            </View>
            <Text>{label}</Text>
        </View>
    );
}

export const PdfTemplate: React.FC<PdfTemplateProps> = ({ data, signatureUrl, lang }) => {
    const t = translations[lang];
    const signedAt = data.signatureDate
        ? new Date(data.signatureDate).toLocaleString(lang === 'es' ? 'es-US' : 'en-US', { dateStyle: 'long', timeStyle: 'short' })
        : '';
    const booleanAnswer = (value: boolean | null) => value === true ? t.yes : value === false ? t.no : '—';

    return (
        <Document title={`${t.headerTitle} — ${data.name}`} author="Between Curves Massage">
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.hero}>
                    <View style={styles.brandRow}>
                        <View style={styles.monogram}><Text style={styles.monogramText}>BCM</Text></View>
                        <View>
                            <Text style={styles.companyTitle}>Between Curves Massage</Text>
                            <Text style={styles.companyTagline}>Wellness · Care · Intention</Text>
                        </View>
                    </View>
                    <Text style={styles.documentEyebrow}>{t.headerTitle}</Text>
                    <Text style={styles.documentTitle}>{lang === 'en' ? 'Your care begins here.' : 'Su cuidado comienza aquí.'}</Text>
                    <Text style={styles.documentIntro}>{t.form_intro}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaPill}>{t.private_badge}</Text>
                        <Text style={styles.metaPill}>{t.consent_version}: {CONSENT_VERSION}</Text>
                    </View>
                </View>

                <View style={styles.section} wrap={false}>
                    <SectionHeader number="01" title={t.personalInfoTitle} />
                    <View style={styles.row}><Field label={t.label_name} value={data.name} /><Field label={t.label_dob} value={data.dob} /></View>
                    <View style={styles.row}><Field label={t.label_age} value={data.age} /><Field label={t.label_gender} value={data.gender} /><Field label={t.label_phone} value={data.phone} /></View>
                    <View style={styles.row}><Field label={t.label_address} value={data.address} /><Field label={t.label_city} value={data.city} /></View>
                    <View style={styles.row}><Field label={t.label_state} value={data.state} /><Field label={t.label_zip} value={data.zip} /><Field label={t.label_email} value={data.email} /></View>
                    <View style={styles.row}><Field label={t.label_emergency} value={data.emergencyContact} /><Field label={t.label_howHeard} value={data.howDidYouHear} /></View>
                    <View style={styles.row}><Field label={t.label_emailList} value={booleanAnswer(data.addedToEmailList)} /></View>
                </View>

                <View style={styles.section}>
                    <SectionHeader number="02" title={t.medicalHistoryTitle} />
                    <Text style={styles.prompt}>{t.medical_prompt_conditions}</Text>
                    <View style={styles.grid}>
                        {Object.entries(data.conditions).map(([key, value]) => key === 'other_conditions' ? null : (
                            <CheckboxItem key={key} label={conditionNamesMaps[lang][key] || key.replace(/_/g, ' ')} checked={Boolean(value)} />
                        ))}
                    </View>
                    {data.conditions.other_conditions && <View style={styles.row}><Field label={t.label_other} value={data.conditions.other_conditions} /></View>}
                    <Text style={styles.prompt}>{t.medical_prompt_other_issues}</Text><Text style={styles.answerBox}>{data.otherMedicalIssues || '—'}</Text>
                    <Text style={styles.prompt}>{t.medical_prompt_procedures}</Text><Text style={styles.answerBox}>{data.recentProcedures || '—'}</Text>
                    <Text style={styles.prompt}>{t.medical_prompt_pregnant}</Text><Text style={styles.answerBox}>{booleanAnswer(data.currentlyPregnant)}</Text>
                    <Text style={styles.prompt}>{t.medical_prompt_meds}</Text><Text style={styles.answerBox}>{data.currentMedications || '—'}</Text>
                </View>

                <View style={styles.section} wrap={false}>
                    <SectionHeader number="03" title={t.massageInfoTitle} />
                    <Text style={styles.prompt}>{t.massage_prompt_type}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_relaxation} checked={data.massageTypeOfInterest.relaxation} />
                        <CheckboxItem label={t.option_swedish} checked={data.massageTypeOfInterest.swedish} />
                        <CheckboxItem label={t.option_therapeutic} checked={data.massageTypeOfInterest.therapeutic} />
                        <CheckboxItem label={t.option_hot_stone} checked={data.massageTypeOfInterest.hot_stone} />
                        <CheckboxItem label={t.option_deep_tissue} checked={data.massageTypeOfInterest.deep_tissue} />
                        <CheckboxItem label={t.option_reflexology} checked={data.massageTypeOfInterest.reflexology} />
                    </View>
                    {data.massageTypeOfInterest.other_type && <View style={styles.row}><Field label={t.label_other} value={data.massageTypeOfInterest.other_type} /></View>}
                    <Text style={styles.prompt}>{t.massage_prompt_areas}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_neck} checked={data.areasOfTension.neck} /><CheckboxItem label={t.option_shoulders} checked={data.areasOfTension.shoulders} />
                        <CheckboxItem label={t.option_back} checked={data.areasOfTension.back} /><CheckboxItem label={t.option_hips} checked={data.areasOfTension.hips} />
                        <CheckboxItem label={t.option_legs} checked={data.areasOfTension.legs} /><CheckboxItem label={t.option_feet} checked={data.areasOfTension.feet} />
                    </View>
                    {data.areasOfTension.other_area && <View style={styles.row}><Field label={t.label_other} value={data.areasOfTension.other_area} /></View>}
                    <Text style={styles.prompt}>{t.massage_prompt_goals}</Text>
                    <View style={styles.grid}>
                        <CheckboxItem label={t.option_relaxation} checked={data.massageGoals.relaxation} /><CheckboxItem label={t.option_stress_reduction} checked={data.massageGoals.stress_reduction} />
                        <CheckboxItem label={t.option_pain_relief} checked={data.massageGoals.pain_relief} /><CheckboxItem label={t.option_injury_recovery} checked={data.massageGoals.injury_recovery} />
                        <CheckboxItem label={t.option_increased_flexibility} checked={data.massageGoals.increased_flexibility} />
                    </View>
                    {data.massageGoals.other_goal && <View style={styles.row}><Field label={t.label_other} value={data.massageGoals.other_goal} /></View>}
                    <Text style={styles.prompt}>{t.massage_prompt_frequency}</Text>
                    <Text style={styles.answerBox}>{data.massageFrequency ? t[`option_${data.massageFrequency}` as keyof typeof t] : '—'}</Text>
                </View>

                <View style={styles.section}>
                    <SectionHeader number="04" title={t.consentTitle} />
                    <View style={styles.legalPanel}>
                        {[t.legal_p1, t.legal_p2, t.legal_p3, t.legal_p4].map(paragraph => <Text key={paragraph} style={styles.legalParagraph}>{paragraph}</Text>)}
                        <Text style={[styles.legalParagraph, { fontWeight: 'bold' }]}>{t.legal_final_agreement}</Text>
                    </View>
                    <Text style={styles.acceptance}>✓ {t.consent_acceptance}</Text>
                    <View style={styles.photoPanel}>
                        <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>{t.photoConsentTitle}</Text>
                        <Text style={styles.legalParagraph}>{t.photo_consent_description}</Text>
                        <Text style={styles.prompt}>{t.photo_consent_prompt}</Text>
                        <Text style={styles.choice}>{booleanAnswer(data.photoConsent)}</Text>
                    </View>
                    <View style={styles.signatureCard} wrap={false}>
                        <Text style={styles.signatureLabel}>{t.label_client_signature}</Text>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image does not support HTML alt */}
                        {signatureUrl && <Image src={signatureUrl} style={styles.signatureImage} />}
                        <Text style={styles.signatureMeta}>{t.printed_name}: {data.name}</Text>
                        <Text style={styles.signatureMeta}>{t.signed_at}: {signedAt}</Text>
                        <Text style={styles.signatureMeta}>{t.consent_version}: {CONSENT_VERSION}</Text>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text>BETWEEN CURVES MASSAGE · {t.private_badge}</Text>
                    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
};
