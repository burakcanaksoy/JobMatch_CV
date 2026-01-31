import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a nice font if desired, but standard fonts work for MVP
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    contact: {
        fontSize: 10,
        marginTop: 5,
        color: '#555',
    },
    section: {
        margin: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 2,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    }
});

interface CVData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        website?: string;
    };
    summary: string;
    experience: Array<{
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        description?: string[]; // Bullet points
    }>;
    education: Array<{
        degree: string;
        school: string;
        location: string;
        startDate: string;
        endDate: string;
    }>;
    skills: string[];
}

export const CVPdfDocument = ({ data }: { data: CVData }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.personalInfo.fullName}</Text>
                <Text style={styles.contact}>
                    {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
                    {data.personalInfo.linkedin ? ` | ${data.personalInfo.linkedin}` : ''}
                </Text>
            </View>

            {/* Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.text}>{data.summary}</Text>
            </View>

            {/* Experience */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.map((exp, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <View style={styles.row}>
                            <Text style={styles.bold}>{exp.title}</Text>
                            <Text style={styles.text}>{exp.startDate} - {exp.endDate}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{exp.company}, {exp.location}</Text>
                        </View>
                        {exp.description?.map((point, i) => (
                            <View key={i} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={[styles.text, { flex: 1 }]}>{point}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, index) => (
                    <View key={index} style={{ marginBottom: 5 }}>
                        <View style={styles.row}>
                            <Text style={styles.bold}>{edu.school}</Text>
                            <Text style={styles.text}>{edu.startDate} - {edu.endDate}</Text>
                        </View>
                        <Text style={styles.text}>{edu.degree}</Text>
                    </View>
                ))}
            </View>

            {/* Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.text}>{data.skills.join(' • ')}</Text>
            </View>

        </Page>
    </Document>
);
