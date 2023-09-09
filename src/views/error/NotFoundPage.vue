<template>

    <div class="border-top-wide border-primary d-flex flex-column">
		<div class="page page-center" style="height: 99vh">
			<div class="container container-tight py-4">
				<div class="empty">
					<div class="empty-header">Error</div>
					<p class="empty-title">죄송합니다.</p>
					<p class="empty-subtitle text-muted">찾으시는 페이지가 없습니다.</p>
					<div class="empty-action">
						<RouterLink class="btn btn-primary" :to="{ path: '/'}">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								<line x1="5" y1="12" x2="19" y2="12" />
								<line x1="5" y1="12" x2="11" y2="18" />
								<line x1="5" y1="12" x2="11" y2="6" />
							</svg>
							처음으로 이동                        
						</RouterLink>
                    </div>
                </div>
            </div>
        </div>
	</div>

</template>
<script>
    export default {        
        data() {
            return {                
            }
        }        
    }
</script>