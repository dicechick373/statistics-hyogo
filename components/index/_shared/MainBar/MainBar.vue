<template>
  <v-card>
    <div>
      <v-row>
        <!-- 都道府県／市区町村 -->
        <v-col cols="12" md="3">
          <gov-type-tab />
        </v-col>

        <!-- 統計項目 -->
        <v-col cols="12" md="3">
          <menu-selector />
        </v-col>

        <v-col cols="12" md="3">
          <city-selector />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
