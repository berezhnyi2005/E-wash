<template>
  <div class="page-container">
    <header class="section-header">
      <div>
        <h1 class="section-header-title">Hodnotenia zákazníkov</h1>

        <p class="section-header-description">
          Prečítajte si skúsenosti našich zákazníkov s ručnou autoumývarňou E-Wash.
        </p>
      </div>

      <div class="reviews-header-right">
        <div
          v-if="totalReviews > 0"
          class="reviews-summary"
        >
          <div class="reviews-summary-main">
            <span class="reviews-summary-score">
              {{ averageRating.toFixed(1) }}
            </span>
            <div class="reviews-summary-stars">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= Math.round(averageRating) }"
              >
                ★
              </span>
            </div>
          </div>
          <div class="reviews-summary-meta">
            {{ totalReviews }} hodnotení
          </div>
        </div>

        <button
          type="button"
          class="btn btn-green"
          @click="openCreateReview"
        >
          Napísať recenziu
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading-text">
      Načítavam hodnotenia…
    </div>

    <div v-else-if="error" class="error-text">
      {{ error }}
    </div>

    <div
      v-else-if="!reviews.length"
      class="empty-text"
    >
      Zatiaľ nemáme žiadne recenzie. Buďte prvý, kto ohodnotí naše služby.
    </div>

    <div
      v-else
      class="reviews-list"
    >
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-card"
      >
        <header class="review-card-header">
          <div class="review-user">
            <div class="review-avatar">
              {{ getInitials(review.user?.name) }}
            </div>
            <div>
              <div class="review-user-name">
                {{ review.user?.name || 'Anonymný zákazník' }}
              </div>
              <div class="review-date">
                {{ formatDate(review.createdAt) }}
              </div>
            </div>
          </div>

          <div class="review-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ active: star <= (review.rating || 0) }"
            >
              ★
            </span>
          </div>
        </header>

        <p class="review-comment">
          {{ review.comment }}
        </p>

        <div
          v-if="review.imgReview"
          class="review-image-wrapper"
        >
          <img
            :src="review.imgReview"
            alt="Foto recenzie"
            class="review-image"
          />
        </div>

        <div
          v-if="review.adminReview"
          class="review-admin-reply"
        >
          <div class="review-admin-label">
            Odpoveď E-Wash
          </div>
          <p class="review-admin-text">
            {{ review.adminReview }}
          </p>
        </div>

        <div
          v-if="isAdmin"
          class="review-admin-actions"
        >
          <button
            v-if="!review.adminReview"
            type="button"
            class="btn btn-ghost"
            @click="openReplyModal(review, 'create')"
          >
            Odpovedať
          </button>

          <button
            v-else
            type="button"
            class="btn btn-ghost"
            @click="openReplyModal(review, 'edit')"
          >
            Upraviť odpoveď
          </button>

          <button
            type="button"
            class="btn btn-danger"
            @click="deleteReview(review.id)"
          >
            Vymazať recenziu
          </button>
        </div>
      </div>
    </div>
  </div>

  <ReviewModal
    v-if="reviewModalVisible"
    v-model:visible="reviewModalVisible"
    :mode="reviewModalMode"
    :review="selectedReview"
    @save="saveReview"
  />

  <ReviewReplyModal
    v-if="replyModalVisible"
    v-model:visible="replyModalVisible"
    :mode="replyModalMode"
    :review="selectedReview"
    @save="saveReply"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReviewModal from '@/components/modal/ReviewModal.vue'
import ReviewReplyModal from '@/components/modal/ReviewReplyModal.vue'

const isAdmin = true
const CURRENT_USER_ID = 1 // zatial nemame registraciu
const API_BASE = 'http://localhost:5000'

const reviews = ref([])
const loading = ref(false)
const error = ref('')

const reviewModalVisible = ref(false)
const reviewModalMode = ref('create')
const selectedReview = ref(null)

const replyModalVisible = ref(false)
const replyModalMode = ref('create')

const apiRequest = async (method, url, body = null) => {
  const options = { method, headers: {} }

  if (body !== null) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const res = await fetch(url, options)
  let data = null

  data = await res.json()
  console.log('PIKAPI', data)

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`)
  }

  return data
}

const getReviews = async () => {
  loading.value = true
  error.value = ''

  try {
    const json = await apiRequest('GET', `${API_BASE}/api/reviews`)
    reviews.value = Array.isArray(json?.data) ? json.data : []
    console.log('💾 reviews z API:', reviews.value)
  } catch (err) {
    error.value = err.message || 'Chyba pri načítavaní hodnotení.'
  } finally {
    loading.value = false
  }
}

const totalReviews = computed(() => reviews.value.length)

const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / reviews.value.length
})

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return 'E'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

const openCreateReview = () => {
  reviewModalMode.value = 'create'
  selectedReview.value = null
  reviewModalVisible.value = true
}

const openReplyModal = (review, mode) => {
  replyModalMode.value = mode
  selectedReview.value = { ...review }
  replyModalVisible.value = true
}

const saveReview = async (formData) => {
  let method = 'POST'
  let url = `${API_BASE}/api/reviews`

  if (formData.mode === 'edit' && selectedReview.value?.id) {
    method = 'PUT'
    url = `${API_BASE}/api/reviews/${selectedReview.value.id}`
  }

  const payload = {
    userId: CURRENT_USER_ID,
    rating: formData.rating,
    comment: formData.comment,
    imgReview: formData.imgReview || null
  }

  try {
    await apiRequest(method, url, payload)
    await getReviews()
  } catch (err) {
    alert(err.message || 'Nepodarilo sa uložiť recenziu.')
  }
}

const saveReply = async ({ id, adminReview }) => {
  if (!id) return

  try {
    await apiRequest('PUT', `${API_BASE}/api/reviews/${id}`, { adminReview })
    await getReviews()
  } catch (err) {
    alert(err.message || 'Nepodarilo sa uložiť odpoveď.')
  }
}

const deleteReview = async (id) => {
  if (!window.confirm('Naozaj chcete vymazať túto recenziu?')) return // zmenim na modal v buducnosti

  try {
    await apiRequest('DELETE', `${API_BASE}/api/reviews/${id}`)
    reviews.value = reviews.value.filter((r) => r.id !== id)
  } catch (err) {
    alert(err.message || 'Nepodarilo sa vymazať recenziu.')
  }
}

onMounted(getReviews)
</script>

<style scoped>
/* Pravá strana заголовка: summary + кнопка */
.reviews-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Блок со средней оценкой */
.reviews-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 12px;
  background-color: var(--white-aktive);
  border: 1px solid var(--color-border);
}

.reviews-summary-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviews-summary-score {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-main);
}

.reviews-summary-stars {
  display: flex;
  gap: 3px;
}

.reviews-summary-meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Список отзывов */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Карточка отзыва */
.review-card {
  padding: 18px 20px;
  border-radius: 14px;
  background-color: var(--white-aktive);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Хедер карточки: пользователь + рейтинг */
.review-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Блок пользователя */
.review-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background-color: var(--grey-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-main);
}

.review-user-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-main);
}

.review-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.star {
  font-size: 16px;
  color: var(--grey-light);
}

.star.active {
  color: var(--blue);
}

.review-comment {
  font-size: 14px;
  color: var(--color-text-main);
}

.review-image-wrapper {
  margin-top: 4px;
}

.review-image {
  max-width: 100%;
  border-radius: 10px;
  display: block;
}

.review-admin-reply {
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: var(--white-aktive);
  border: 1px solid var(--blue-light);
}

.review-admin-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  margin-bottom: 2px;
}

.review-admin-text {
  font-size: 13px;
  color: var(--color-text-main);
}

.review-admin-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.empty-text,
.loading-text,
.error-text {
  text-align: center;
  padding: 25px 0;
  font-size: 14px;
}

.empty-text,
.loading-text {
  color: var(--color-text-muted);
}

.error-text {
  color: var(--red);
}

@media (max-width: 768px) {
  .section-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .section-header-title {
    font-size: 22px;
  }

  .section-header-description {
    font-size: 14px;
  }

  .reviews-header-right {
    width: 100%;
    justify-content: space-between;
  }

  .reviews-summary {
    align-items: flex-start;
    flex: 1;
  }

  .reviews-summary-score {
    font-size: 22px;
  }

  .reviews-header-right .btn {
    white-space: nowrap;
  }

  .review-card {
    padding: 14px 16px;
  }
}

@media (max-width: 480px) {
  .reviews-header-right {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .reviews-summary {
    width: 100%;
  }

  .reviews-header-right .btn {
    width: 100%;
    text-align: center;
  }

  .review-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .review-rating {
    margin-top: 4px;
  }

  .review-admin-actions {
    justify-content: flex-start;
  }

  .review-admin-actions .btn {
    flex: 1 1 100%;
  }

  .review-comment {
    font-size: 13px;
  }
}
</style>
