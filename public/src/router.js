import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Login from './views/login/Login.vue'
import LoginGenWords from './views/login/GenWords'
import LoginImportWords from './views/login/ImportWords'
import LoginSetPassword from './views/login/SetPassword'
import LoginExport from './views/login/Export'
import LoginWriteWords from './views/login/WriteWords'
import Main from './views/Main'
import DashboardIndex from './views/dashboard/Index.vue'
import ExplorerIndex from './views/explorer/Index.vue'
import ExplorerList from './views/explorer/List.vue'
import ExplorerTransaction from './views/explorer/Transaction.vue'
import ExplorerResult from './views/explorer/Result.vue'
import AccountIndex from './views/account/Index.vue'
import ContactIndex from './views/contact/Index.vue'
import SettingsIndex from './views/settings/Index.vue'
import MessageIndex from './views/message/Index.vue'
import ContactDetail from './views/contact/Detail.vue'
import DappIndex from './views/dapp/Index.vue'
import DappAssets from './views/dapp/Assets.vue'

Vue.use(Router)

export default new Router({
  	routes: [
    	{
      		path: '/',
      		name: 'index',
      		component: Index
		},
		{
			path: '/login',
			component: Login,
			children: [
				{
					path: 'import',
					component:  LoginImportWords
				},
				{
					path: 'gen',
					component: LoginGenWords
				},
				{
					path: 'set',
					component: LoginSetPassword
				},
				{
					path: 'export',
					component: LoginExport
				},
				{
					path: 'write',
					component: LoginWriteWords
				}
			]
		},

		{
			path: '/main',
			component: Main,
			meta: { requiresAuth: true },
			children: [
				
				{
					path: 'dashboard',
					name: 'dashboard',
					component: DashboardIndex
				},
				{
					path: 'explorer',
					component: ExplorerIndex,
					children: [
						{
							path: '/',
							name: 'explorer',
							component: ExplorerList
						},
						{
							path: 'result/:query',
							name: 'explorerResult',
							component: ExplorerResult
						},
						{
							path: 'transaction/:id',
							name: 'explorerTransaction',
							component: ExplorerTransaction
						}
					]
                },
                {
                    path: 'dapp',
                    name: 'dapp',
                    component: DappIndex
                },
                {
                    path: 'dapp/assets',
                    name: 'dappAssets',
                    component: DappAssets
                },
				{
					path: 'account',
					name: 'account',
					component: AccountIndex
                },
                
				{
					path: 'contact',
					name: 'contact',
					component: ContactIndex
				},
				
				{
					path: 'contact/detail/:id',
					name: 'contactDetail',
					component: ContactDetail
				},

				{
					path: 'settings',
					name: 'settings',
					component: SettingsIndex
				},
				{
					path: 'message',
					name: 'message',
					component: MessageIndex
				}
			]
		}
  	]
})
