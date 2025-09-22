<template>
    <v-responsive>
        <div id="mainContainer">
            <v-container fluid tag="section" aria-labelledby="title">
                <v-main>
                    <v-row>
                        <v-col cols="6" offset="1">
                            <h1>Expertise Monitor ({{ appStore.getReadOnly() ? 'Read Only' : 'Edit Mode' }})</h1>
                            <v-container fluid>
                                <v-row>
                                    <v-col cols="6">
                                        <p>Deze applicatie geeft een overzicht van de expertise in het ecosysteem, per
                                            organisatieeenheid (zowel bedrijven als domeinen). Bedrijven kunnen
                                            "expertiseclaims" maken: aangeven dat ze op een bepaalde expertise (een
                                            technologie of product, een rol, methode, vakgebied of standaard) een zeker
                                            aantal collega's hebben. Met een notitie kan nader worden geduid wat de
                                            claim inhoudt.
                                            <br /><br />
                                            Bij een claim worden ook de ambitie van een bedrijf ten aanzien van een
                                            expertise vastgelegd: wil het bedrijf hierin groeien of zich handhaven,
                                            starten met een verkenning of juist de expertise loslaten en afbouwen.
                                            <br /><br />


                                            Het is de intentie om ook partners en certificeringen in de applicatie op te
                                            nemen. Mogelijk ook Technology Radars per tag en per bedrijf.

                                        <p class="text-caption" style="color: red">Deze applicatie is nog in
                                            ontwikkeling.
                                            Je kunt tegen fouten
                                            aanlopen. Ook is het mogelijk dat data die je hebt
                                            toegevoegd kwijtraakt. Uiteraard
                                            probeer ik dat zoveel mogelijk te beperken.

                                            Als je tegen problemen aanloopt, zou je die willen melden? Ook als je
                                            verbetersuggesties hebt voor de
                                            applicatie hoor ik dat heel graag. Je kunt dat doen via email:
                                            lucas.jellema@conclusion.nl
                                            .
                                        </p>
                                        </p>
                                    </v-col>
                                    <v-col cols="6">

                                        <v-expansion-panels :multiple="false" class="mt-6">
                                            <v-expansion-panel title="QR Code om de app te delen"
                                                collapse-icon="mdi-qrcode" expand-icon="mdi-qrcode"
                                                @click="generateQrCode">
                                                <v-expansion-panel-text>
                                                    <div>
                                                        <h2>QR Code om de applicatie en alle data te delen</h2>
                                                        <canvas id="canvas"></canvas>
                                                        <h4 class="text-caption">NB: Iemand met deze QR Code kan alle
                                                            data
                                                            zien</h4>
                                                    </div>
                                                </v-expansion-panel-text>
                                            </v-expansion-panel>

                                        </v-expansion-panels>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>

                        <v-col cols="3" offset="0">
                            <v-card class="mx-auto" max-width="434" variant="outlined" >
                                <v-card-item>
                                    <div>
                                        <div class="text-h6 mb-1">
                                            Overview
                                        </div>
                                        <div class="text-caption">
                                            {{ appStore.expertiseTags.length }} expertise tags and
                                            {{ expertise.expertise.length }} technologies, products, roles and other areas
                                            of expertise.

                                            <v-btn text prepend-icon="mdi-map-search" to="/expertiseBrowse"
                                                class="mt-2">Expertise in Ecosysteem</v-btn>
                                            <v-btn text prepend-icon="mdi-account-group" to="/organization"
                                                class="mt-2">Organization & Expertise</v-btn>
                                            <v-btn text prepend-icon="mdi-brain" to="/expertise" class="mt-2">Expertise
                                                Catalog</v-btn>

                                        </div>
                                    </div>
                                </v-card-item>
                            </v-card>


                        </v-col>
                    </v-row>
                </v-main>
            </v-container>
        </div>
    </v-responsive>
</template>


<script setup>
import { useAppStore } from "@/stores/app";
import { nextTick } from 'vue';

const appStore = useAppStore()
const expertise = appStore.getExpertise()


import QRCode from 'qrcode'

const renderQRCode = (myurl) => {
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1,
        scale: 5,
        color: {
            dark: "#010599FF",
            light: "#FFFFFF"
        }
    }
    var canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, myurl, opts, function (error) {
        if (error) console.error(error)
    })
}

const generateQrCode = () => {
    console.log("generateQrCode")
    renderQRCode(window.location.href)
}



const createIncident = () => {
    console.log('create incident')
    //todo navigation to incident creation page
}

onMounted(() => {
    const onKeyDown = (event) => {
        if (event.altKey && event.key === 'l') {
            appStore.toggleReadOnly()
        }
    };
    document.addEventListener('keydown', onKeyDown);
    onUnmounted(() => {
        document.removeEventListener('keydown', onKeyDown);
    });
})



</script>
<style scoped></style>