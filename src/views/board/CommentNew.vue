<template>
    <div class='row input-group mt-2'>
        <div class='col'>
            <input type='text' class='form-control form-control-sm' value='' />
        </div>;
        <div class='col-auto'>
            <button class='btn btn-primary btn-sm' @click="createReplyComment(boardId)">저장</button>
        </div>
    </div>
</template>
<script>
export default {
    props : {
        boardId : Number
    }
}

</script>