<template>
    <h1>Raw Expertise</h1>
    <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
    <v-btn @click="copyExpertiseCatalogToClipboard">Copy Expertise Catalog to clipboard</v-btn>
    <v-btn @click="copyWithoutCatalogToClipboard">Copy Expertise Claims & Organization Structure to clipboard</v-btn>
    {{appStore.expertiseTags}}
    <code class="language-json">{{ JSON.stringify(expertiseCleaned) }}</code>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()
const expertiseCleaned = ref(null)
const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(expertiseCleaned.value));
}

const orgs = ref([])

const copyExpertiseCatalogToClipboard = () => {
    navigator.clipboard.writeText(`{"expertise": ${JSON.stringify(expertiseCleaned.value.expertise)}}`)
}

const copyWithoutCatalogToClipboard = () => {
    const copyContent = JSON.parse(JSON.stringify(expertiseCleaned.value))
    copyContent.expertise = []
    navigator.clipboard.writeText(JSON.stringify(copyContent));

}

onMounted(() => {
    // clone expertise
    const e = { ...expertise.value }


    // remove tags we do not want anymore
    const unwantedTags =
    ["3g","A/B testing","APM","cloud monitoring","JVM","POS systems", "alerting", "cloud-based", "conversion optimization", "digital transformation", "in-memory","sql","ML observability","community"
    ,"IDE", "Microsoft Dynamics NAV","broker", "high-performance", "pipeline", "retail solutions","json","online store","end-to-end","machine data", "headless commerce","digital experience","enterprise"]
for (const expertise of e.expertise) {
    // remove tags we do not want anymore
    expertise.tags = expertise.tags.filter(tag => !unwantedTags.includes(tag))

}
    for (const expertise of e.expertise) {
        expertise.tags = expertise.tags.filter(tag => allowedTags.includes(tag))
}

    for (const expertise of e.expertise) {
        expertise.tags = expertise.tags.map(tag => tag.toLowerCase())
    }

    // remove circular references 

    // remove organization property from organizationMemberships
    // remove memberOrganizations property from organizations

    const organization = e.organization
    for (const org of organization) {
        orgs.value.push({ name: org.name, id: org.id })
        // remove property memberOrganizations from org
        delete org.memberOrganizations
        if (org.organizationMemberships && org.organizationMemberships.length > 0) {
            for (const membership of org.organizationMemberships) {
                delete membership.organization
            }
        }
        if (org.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {
                delete claim.expertise
                delete claim.organization
            }
        }
        if (org.vendorRelations && org.vendorRelations.length > 0) {
            for (const relation of org.vendorRelations) {
                delete relation.vendor
            }
        }
    }



    for (const author of authors) {
        if (author.organizationId) {
            authorMap[author.organizationId] = author.author
        }
    }



    for (const org of organization) {
       // org.expertiseClaims=[]
        if (org.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {  
                if (!claim.asOf)
                claim.asOf = "244"
                //claim.author = authorMap[org.id]
            }
        }
        if (!org.vendorRelations) org.vendorRelations = []
        if (!org.certifications ) org.certifications = []
    }       

    expertiseCleaned.value = e
})

const authors = [{ "organizationId": "52", "author": "Bart Janssen", "notes": "Conclusion Confidential" }, { "organizationId": "33", "author": "Sander Rosenhart", "notes": "Conclusion Enablement" }, { "organizationId": "53", "author": "Robbert Waijenberg & Jos Smits", "notes": "Virtual Sciences " }
, { "organizationId": "59", "author": "Roel Gloudemans, Jakob Hofland & Ard van der Lee" }, { "organizationId": "37", "author": "Ann Ouvry", "notes": "D&A" }, { "organizationId": "3", "author": "Michiel Kroeks", "notes": "Conclusion Experience " }, { "organizationId": "51", "author": "Mark Leck", "notes": "Yellowtail" }, { "organizationId": "35", "author": "Marc de Beer", "notes": "Conclusion Mission Critical" }, { "organizationId": "47", "author": "Michiel Croon", "notes": "ConclusionConsulting" }, { "organizationId": "44", "author": "Robert Schras", "notes": "Conclusion ForeyeT" }, { "organizationId": "42", "author": "René Altena", "notes": "Conclusion MBS" }, { "organizationId": "38", "author": "Jeroen Oudenaarden", "notes": "Future Facts Conclusion" }, { "organizationId": "36", "author": "Bas Wencker", "notes": "Furore" }, { "organizationId": "34", "author": "Mark Elstgeest", "notes": " Morgens" }, { "organizationId": "43", "author": "Simon Lambermon", "notes": "myBrand" }, { "organizationId": "40", "author": "Corniels van Winkelen", "notes": "First8" }, { "organizationId": "46", "author": "Sebastiaan Leeuwenkamp", "notes": "Conclusion AFAS Solutions" }, { "organizationId": "31", "author": "Ernout Douqué", "notes": "Hot ITem" }, { "organizationId": "1", "author": "Anthony Dickinson", "notes": "Conlusion Low Code Company" }, { "organizationId": "41", "author": "Jitse Klomp", "notes": "Xforce" }, { "organizationId": "39", "author": "Timothy Pranger", "notes": "Mediaan Conclusion" }, { "organizationId": "30", "author": "Erick Schabracq", "notes": "AMIS" }]
const authorMap = {}

const allowedTags = [
    ".NET",
    ".Net",
    "AI",
    "API",
    "AWS",
    "Azure",
    "BPM",
    "CI/CD",
    "CMS",
    "CRM",
    "CSS",
    "DevOps",
    "EHR",
    "ERP",
    "ETL",
    "Google",
    "Google Cloud Platform",
    "IBM",
    "IaC",
    "IoT",
    "Kubernetes",
    "Linux",
    "Microsoft",
    "NoSQL",
    "OCI",
    "Oracle",
    "PostgreSQL",
    "Python",
    "RDBMS",
    "RPA",
    "Red Hat",
    "SAP",
    "SQL Server",
    "access management",
    "agile",
    "ai",
    "amazon",
    "application development",
    "automation",
    "aws",
    "big data",
    "cloud",
    "collaboration",
    "container orchestration",
    "customer data platform",
    "data governance",
    "data integration",
    "data science",
    "database",
    "document management",
    "e-commerce",
    "epd",
    "etl",
    "event driven",
    "frontend",
    "google",
    "headless CMS",
    "healthcare",
    "iOS development",
    "iPaaS",
    "ibm",
    "identity management",
    "inbound marketing",
    "infrastructure as a service",
    "integration",
    "issue tracking",
    "low code",
    "low-code",
    "machine learning",
    "marketing automation",
    "microsoft",
    "monitoring",
    "multi model",
    "network",
    "no code",
    "no-code",
    "nosql",
    "observability",
    "olap",
    "open source",
    "oracle",
    "performance",
    "platform as a service",
    "preprocessor",
    "programming language",
    "project management",
    "provisioning",
    "rdbms",
    "risk management",
    "sap",
    "security",
    "serverless",
    "storage",
    "stream processing",
    "telemetry",
    "testing",
    "time series",
    "tracing",
    "unit testing",
    "user experience",
    "version control",
    "web development",
    "workflow"
]

</script>