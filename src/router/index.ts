import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/balance-view",
      name: "balance_view",
      component: () => import("@/pages/views/balance/BalanceView.vue"),
    },
    {
      path: "/",
      name: "home_view",
      component: () => import("@/pages/views/home/HomeView.vue"),
    },
    {
      path: "/operations-log-view",
      name: "operationsLog_view",
      component: () =>
        import("@/pages/views/operations-log-view/OperationsLogView.vue"),
    },
    {
      path: "/options-view",
      name: "options-view",
      component: () =>
        import("@/pages/views/statistics-view/options/OptionsView.vue"),
    },
    {
      path: "/stat-all-operations",
      name: "stat-all-operations",
      component: () =>
        import("@/pages/views/statistics-view/statistic-all-operations/StatAllOperations.vue"),
    },
    {
      path: "/statistic-daily-limit",
      name: "statistic_daily_limit",
      component: () =>
        import("@/pages/views/statistics-view/statistic-daily-limit/StatisticDailyLimit.vue"),
    },
    {
      path: "/stat-tags-chart",
      name: "stat-tags-chart",
      component: () =>
        import("@/pages/views/statistics-view/tags-chart/TagsChart.vue"),
    },
    {
      path: "/statistics-view",
      name: "statistics_view",
      component: () =>
        import("@/pages/views/statistics-view/StatisticsView.vue"),
    },
    {
      path: "/wallet-view",
      name: "wallet_view",
      component: () => import("@/pages/views/wallet-view/WalletView.vue"),
    },
    {
      path: "/card-one-view/:id",
      name: "card-one_view",
      component: () => import("@/pages/views/wallet-view/CardOne/CardOne.vue"),
    },
    {
      path: "/cards-view",
      name: "cards_view",
      component: () => import("@/pages/views/wallet-view/cards/CardsView.vue"),
    },
    {
      path: "/new-card-view",
      name: "newCard_view",
      component: () =>
        import("@/pages/views/wallet-view/new-card/NewCardView.vue"),
    },
  ],
});

export default router;
