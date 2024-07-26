<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="6" offset="1">
                        <h1>Expertise Monitor</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="6">
                                    <p>Deze applicatie geeft een overzicht van de expertise in het ecosysteem, per organisatieeenheid (zowel bedrijven als domeinen).
                                        <br />
                                        {{ appStore.getExpertise() }}
                                    <p class="text-caption" style="color: red">Deze applicatie is nog in ontwikkeling.
                                        Je kunt tegen fouten
                                        aanlopen. Ook is het mogelijk dat data die je hebt
                                        toegevoegd kwijtraakt. Uiteraard
                                        probeer ik dat zoveel mogelijk te beperken.

                                        Als je tegen problemen aanloopt, zou je die willen melden? Ook als je
                                        verbetersuggesties hebt voor de
                                        applicatie hoor ik dat heel graag. Je kunt dat doen via
                                        <v-btn prepend-icon="mdi-account-box-edit-outline" text to="/incident">Meld
                                            Incident</v-btn>
                                        .
                                    </p>
                                    </p>
                                </v-col>
                                <v-col cols="6">

                                    <v-expansion-panels :multiple="false" class="mt-6">
                                        <v-expansion-panel title="QR Code om de app te delen" collapse-icon="mdi-qrcode"
                                            expand-icon="mdi-qrcode" @click="generateQrCode">
                                            <v-expansion-panel-text>
                                                <div>
                                                    <h2>QR Code om de applicatie en alle tips te delen</h2>
                                                    <canvas id="canvas"></canvas>
                                                    <h4 class="text-caption">NB: Iemand met deze QR Code kan alle data
                                                        zien en wijzigen</h4>
                                                </div>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>

                                    </v-expansion-panels>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>

                    <v-col cols="2" offset="0">
                        <v-card class="mx-auto" max-width="344" variant="outlined">
                            <v-card-item>
                                <div>
                                    <div class="text-h6 mb-1">
                                        Routekaart
                                    </div>
                                    <div class="text-caption">
                                        <v-btn prepend-icon="mdi-star-plus-outline" title="Voeg een tip toe"
                                            class="mb-2" to="/" >Nieuwe
                                            Tip</v-btn>
                                    </div>
                                </div>
                            </v-card-item>
                        </v-card>

                        
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
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

})



</script>
<style scoped>
</style>