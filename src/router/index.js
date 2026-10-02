import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GradeView from '../views/GradeView.vue'
import SubjectView from '../views/SubjectView.vue'
import ExerciseView from '../views/ExerciseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/grade/:gradeId',
      name: 'grade',
      component: GradeView,
    },
    {
      path: '/grade/:gradeId/subject/:subjectId',
      name: 'subject',
      component: SubjectView,
    },
    {
      path: '/grade/:gradeId/subject/:subjectId/exercise/:exerciseId',
      name: 'exercise',
      component: ExerciseView,
    },
  ],
})

export default router
