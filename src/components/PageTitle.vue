<template>
    <div class="page-header d-print-none">
        <div class="row align-items-center">
            <div class="col">
                <div class="page-pretitle">{{ preTitle }}</div>
                <h2 class="page-title">{{ title }}</h2>
            </div>
            <div class="col-auto">
                <div class="btn-list float-end">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            preTitle: {
                type: String,
                default: "title"
            },
            title: {
                type: String,
                default: "페이지 제목입니다."
            }
        }
    }
</script>