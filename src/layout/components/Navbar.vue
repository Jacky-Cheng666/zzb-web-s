<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <search id="header-search" class="right-menu-item" />
      <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
      
      <!-- <el-tooltip effect="dark" content="切换公司主体" placement="bottom" class="right-menu-item">
        <el-dropdown trigger="click" @command="switchCompany">
          <div>
            <svg-icon class-name="company-icon" icon-class="company" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of company_list" :key="item.value" :disabled="currentCompany===item.value" :command="item.value">
              {{item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip> -->

      <el-tooltip class="item" effect="dark" content="返回主页" placement="bottom">
          <router-link to="/">
            <svg-icon icon-class="home" class="right-menu-item homeIcon"></svg-icon>
          </router-link>
      </el-tooltip>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      company_list: [
        { label: '深圳市测试专用有限公司', value: 'company1' },
        { label: '第二测试有限公司', value: 'company2' },
      ],
      currentCompany: "company1"
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    switchCompany(val) {
      this.currentCompany = val;
      this.refreshView()
      this.$message({
        message: '切换成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 20px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
      .company-icon {
        cursor: pointer;
      }
    }
    .homeIcon {
      display: inline-block;
      cursor: pointer;
      width: 34px;
      height: 34px;
      vertical-align: 6px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
