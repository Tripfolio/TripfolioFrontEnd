<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable prettier/prettier -->
<template>
	<div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
		<h2 class="text-2xl font-bold mb-4">動態追蹤</h2>
		<!--切換選單-->
		<div class="flex gap-4 mb-6">
			<button
				v-for="tab in tabs"
				:key="tab.key"
				@click="activeTab=tab.key"
				:class="[
					'px-4 py-2 rounded-full border',
					activeTab === tab.key
						? 'bg-blue-600 text-white border-blue-600'
						: 'bg-white text-gray-700 border-gray-300'
				]"
			>
				{{ tab.label }}
			</button>
		</div>

		<!--卡片顯示區-->
		<div class="grid grid-cols-2 gap-4">
			<template v-if="activeTab === 'travels'">
				<div
					v-for="travel in travels"
					:key="travel.id"
					@click="goToTravel(travel.id)"
					class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer"
				>
					<img
						:src="travel.coverURL"
						@error="e => e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'"
						class="w-full h-60 object-cover rounded-t-lg"
						alt="行程預覽圖"
					/>
					<div class="p-2">
						<div class="font-semibold">{{ travel.title }}</div>
						<div class="text-sm text-gray-500">{{ travel.startDate }} ~ {{ travel.endDate }}</div>
					</div>
				</div>
			</template>

			<template v-else-if="activeTab === 'posts'">
				<div
					v-for="post in posts"
					:key="post.id"
					@click="goToPost(post.id)"
					class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer"
				>
					<img
						:src="post.coverImage"
						class="w-full h-60 object-cover rounded-t-lg"
						alt="貼文預覽圖"
					/>
					<div class="p-2">
						<div class="font-semibold">{{ post.title }}</div>
					</div>
				</div>
			</template>

			<template v-else-if="activeTab === 'collected'">
				<div
					v-for="collected in collectedPosts"
					:key="collected.id"
					@click="goToPost(collected.id)"
					class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer"
				>
					<img
						:src="collected.postImage"
						class="w-full h-60 object-cover rounded-t-lg"
						alt="貼文預覽圖"
					/>
					<div class="p-2">
						<div class="font-semibold">{{ collected.title }}</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
