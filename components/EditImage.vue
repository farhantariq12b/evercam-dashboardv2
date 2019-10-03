<template>
    <v-layout class="pr-2 pl-2">
        <v-snackbar
            v-model="snackbar"
            :bottom="y === 'bottom'"
            :color="color"
            :multi-line="mode === 'multi-line'"
            :timeout="timeout"
            :top="y === 'top'"
            :vertical="mode === 'vertical'"
        >
        {{ text }}
        <v-btn dark text @click="snackbar = false">
            <v-icon>fas fa-times</v-icon>
        </v-btn>
        </v-snackbar>
        <v-container>
            <v-row cols="12">
                <v-col md="4">
                    <v-btn color="primary" @click="backTab" text ><v-icon class="pr-2">fas fa-arrow-left</v-icon>Back</v-btn>
                </v-col>
                <v-col
                md="1"
                class="ml-auto"
                >
                    <v-btn color="primary" @click="backTab" class="float-right" text ><v-icon>fas fa-trash-alt</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row cols="12" ref="rowWith">
                <v-layout align-center justify-center>
                    <v-btn color="secundary" text :disabled="undoDisabled" @click="undo"><v-icon>fas fa-undo-alt</v-icon></v-btn>
                    <v-btn color="secundary" text :disabled="redoDisabled" @click="redo"><v-icon>fas fa-redo-alt</v-icon></v-btn>
                    <v-btn color="secundary" text @click="stopDrawing"><v-icon>fas fa-hand-paper</v-icon></v-btn>
                    <v-btn color="secundary" text @click="isCropping = true; selectedType = 'CROPPER'; selectedShape = null; startDrawing()"><v-icon>fas fa-crop</v-icon></v-btn>
                    <v-btn color="secundary" text @click="selectedType = 'LINE_DRAWING'; selectedShape = null; startDrawing()"><v-icon>fas fa-minus</v-icon></v-btn>
                    <v-btn color="secundary" text @click="selectedType = 'FREE_DRAWING'; selectedShape = null; startDrawing()"><v-icon>mdi-gesture</v-icon></v-btn>
                    <v-btn color="secundary" text @click="selectedType = 'SHAPE'; selectedShape = 'rect'; startDrawing()"><v-icon>far fa-square</v-icon></v-btn>
                    <v-btn color="secundary" text @click="selectedType = 'SHAPE'; selectedShape = 'circle'; startDrawing()"><v-icon>far fa-circle</v-icon></v-btn>
                    <v-btn color="secundary" text @click="addArrow"><v-icon>fas fa-arrow-right</v-icon></v-btn>
                    <v-btn color="secundary" text @click="selectedType = 'TEXT'; selectedShape = null; startDrawing()"><v-icon>fas fa-font</v-icon></v-btn>
                    <div
                    v-for="color in colors"
                    :key="color"
                    :class="{ highlight: color == selectedColor }"
                    class="pa-1"
                    >
                        <v-btn
                            x-small
                            @click="selectedColor = color; startDrawing()"
                            :color="color"
                        >
                        </v-btn>
                    </div>
                </v-layout>
            </v-row>
            <v-row v-if="isCropping" cols="12">
                <v-layout align-center justify-center>
                    <v-btn color="primary" class="ma-2" @click="crop(); isCropping = false">Apply</v-btn>
                    <v-btn color="primary" @click="stopDrawing(); isCropping = false">Cancel</v-btn>
                </v-layout>
            </v-row>
            <div :style="`height: ${height}px`">
                <tui-image-editor
									ref="tuiImageEditor"
									:include-ui="useDefaultUI"
									:options="options"
									@redoStackChanged="redoStackChanged"
									@undoStackChanged="undoStackChanged"
									@addText="addText"
								>
								</tui-image-editor>
            </div>
            <v-row cols="12">
                <v-col md="4" class="pb-0">
                    <v-text-field
                        v-if="editTitle"
                        v-model="title"
                        label="Solo"
                        class="float-left pr-2"
                        placeholder="Placeholder"
                        solo
                    ></v-text-field>
                    <p v-else class="float-left pr-2 title">
                        {{ selectedTitle }}
                    </p>
                    <div v-if="editTitle">
                        <v-icon
                            color="primary"
                            size="18"
                            @click="
                                editTitle = !editTitle
                                selectedTitle = title
                            "
                        >
                            fas fa-save
                        </v-icon>
                        <v-icon
                            color="primary"
                            size="18"
                            @click="
                                editTitle = !editTitle
                            "
                        >
                            fas fa-times
                        </v-icon>
                    </div>
                    <v-icon
                        v-else
                        color="primary"
                        size="18"
                        @click="title = selectedTitle; editTitle = !editTitle"
                    >
                        fas fa-pencil-alt
                    </v-icon>
                </v-col>
                <v-col
                md="3"
                class="ml-auto pb-0"
                >
                    <v-btn color="primary" class="float-right" text @click="downloading = true; download()">
                        <v-progress-circular
                            v-if="downloading"
                            :size="20"
                            :width="2"
                            color="primary"
                            indeterminate
                            class="spin-loading pr-2"
                        />
                        <v-icon v-else class="pr-2">fas fa-download</v-icon>
                        Download
                    </v-btn>
                    <v-btn color="primary" class="float-right" @click="createArchive" text><v-icon class="pr-2">fas fa-save</v-icon>Save</v-btn>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row cols="12">
                <v-col md="12">
                    <p class="subtitle font-weight-bold float-left pr-2">Requested by: </p><p class="subtitle">{{ firstname }} {{ lastname }}</p>
                    <p class="subtitle font-weight-bold float-left pr-2">Cloud Recording: </p><p class="subtitle">{{ formatedDate }}</p>
                </v-col>
            </v-row>
        </v-container>
    </v-layout>
</template>

<style scoped>
.highlight {
  border: 5px solid #1976d2;
}
</style>>

<script>
import { mapGetters } from "vuex"
import { ImageEditor } from '@toast-ui/vue-image-editor'
import moment from 'moment'
import 'file-saver'

export default {
    name: "selectedImage",
    components: {
        'tui-image-editor': ImageEditor
    },
    props: {
        image: Object,
        edit: Boolean
    },
    data: function() {
        return {
						useDefaultUI: false,
            options: {
							cssMaxWidth: "100%",
							cssMaxHeight: "100%",
							usageStatistics: false,
							selectionStyle: {
								cornerSize: 50,
								rotatingPointOffset: 70
							}
						},
            colors: ['#FF0000', '#0000FF', '#FFFF00', '#000000', '#FFFFFF', '#00FF40'],
            selectedColor: 'red',
            selectedType: null,
            selectedShape: null,
            selectedImage: this.image,
            editImage: this.edit,
            isCropping: false,
            selectedTitle: '',
            editTitle: false,
            downloading: false,
            height: 0,
            color: "",
            mode: "",
            snackbar: false,
            text: "",
            timeout: 3000,
						y: "top",
						undoDisabled: true,
						redoDisabled: true
        };
    },
    computed: {
        ...mapGetters(["firstname", "lastname", "username"]),
        formatedDate() {
            var date = new Date(this.selectedImage.created_at)
            return moment(date).format("DD/MM/YYYY HH:mm")
        }
    },

    mounted() {
        this.$refs.tuiImageEditor.invoke('loadImageFromURL', this.selectedImage.data, 'My sample image').then((data) => {
            var height = (data.newHeight * this.$refs.rowWith.clientWidth) / data.newWidth
            this.height = height
						this.$refs.tuiImageEditor.invoke('resizeCanvasDimension',{ width: this.$refs.rowWith.clientWidth, height: height }).then((data) => {
							this.$refs.tuiImageEditor.invoke('clearUndoStack')
						})
        });
        this.selectedTitle = this.selectedImage.created_at
        this.selectedType = 'FREE_DRAWING'
        this.startDrawing()
    },
    methods: {
        backTab() {
            this.$emit('changeView', false)
        },
        startDrawing() {
            if(this.selectedShape) {
                this.$refs.tuiImageEditor.invoke('setDrawingShape', this.selectedShape, {
                    stroke: this.selectedColor,
                    strokeWidth: 15,
                    fill: 'transparent'
                });
            }
            this.stopDrawing()
            this.$refs.tuiImageEditor.invoke('startDrawingMode', this.selectedType, {
                width: 15,
                color: this.selectedColor
            });
        },
        stopDrawing() {
            this.$refs.tuiImageEditor.invoke('stopDrawingMode')
        },
        redo() {
            this.$refs.tuiImageEditor.invoke('redo')
        },
        undo() {
            this.$refs.tuiImageEditor.invoke('undo')
        },
        crop() {
            var toCrop = this.$refs.tuiImageEditor.invoke('getCropzoneRect')
            this.$refs.tuiImageEditor.invoke('crop', toCrop).then((data) => {
                var height = (data.newHeight * this.$refs.rowWith.clientWidth) / data.newWidth
                this.height = height
                this.$refs.tuiImageEditor.invoke('resizeCanvasDimension',{ width: this.$refs.rowWith.clientWidth, height: height });
            });
            this.stopDrawing()
        },
        addText(pos) {
            this.$refs.tuiImageEditor.invoke('addText', 'Double click', {
							position: pos.originPosition,
							styles: {
									fill: this.selectedColor,
									fontSize: 150
							},
            }).then(function (objectProps) {
							console.log(objectProps);
      			});
        },
        addArrow() {
            this.$refs.tuiImageEditor.invoke('addIcon', 'arrow', {
                fill: this.selectedColor
            })
            this.stopDrawing()
        },
        async download() {
            var file = this.$refs.tuiImageEditor.invoke('toDataURL')
            var response = await fetch(file).then(res => res.blob())
            var type = response.type.split('/')[1];
            var title = this.selectedTitle + '.' + type;
            saveAs(file, title)
            this.downloading = false
        },
        createArchive() {
            let formData = new FormData()
            let d = new Date(this.selectedImage.created_at)
            let date = moment(d).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
            let imageData = this.$refs.tuiImageEditor.invoke('toDataURL')
            formData.append("from_date", d)
            formData.append("to_date", d)
            formData.append("title", this.selectedTitle)
            formData.append("type", "edit")
            formData.append("content", imageData)
            formData.append("file_extension", "png")
            formData.append("requested_by", this.username)
            formData.append("from_date", date)
            formData.append("to_date", date)
            this.$axios
                .$post(
                    `${process.env.API_URL}cameras/${this.$route.params.id}/archives`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                ).then(() => {
                    this.color = "success"
                    this.text = "Image saved and you can check on archives"
                    this.snackbar = true
                })
                .catch(() => {
                    this.color = "error"
                    this.text = "We can not save the image"
                    this.snackbar = true
                })
        },
        undoStackChanged: function(length) {
					if (length) {
						this.undoDisabled = false
					} else {
						this.undoDisabled = true
					}
        },
        redoStackChanged: function(length) {
					if (length) {
						this.redoDisabled = false
					} else {
						this.redoDisabled = true
					}
				}
    }
}
</script>
