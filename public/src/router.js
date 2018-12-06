import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import( './views/Index.vue')
const Login = () => import( './views/login/Login.vue')
const LoginGenWords = () => import( './views/login/GenWords')
const LoginImportWords = () => import( './views/login/ImportWords')
const LoginSetPassword = () => import( './views/login/SetPassword')
const LoginExport = () => import( './views/login/Export')
const LoginWriteWords = () => import( './views/login/WriteWords')
const Main = () => import( './views/Main')
const DashboardIndex = () => import( './views/dashboard/Index.vue')
const ExplorerIndex = () => import( './views/explorer/Index.vue')
const ExplorerList = () => import( './views/explorer/List.vue')
const ExplorerTransaction = () => import( './views/explorer/Transaction.vue')
const ExplorerResult = () => import( './views/explorer/Result.vue')
const AccountIndex = () => import( './views/account/Index.vue')
const ContactIndex = () => import( './views/contact/Index.vue')
const SettingsIndex = () => import( './views/settings/Index.vue')
const MessageIndex = () => import( './views/message/Index.vue')
const ContactDetail = () => import( './views/contact/Detail.vue')
const AssetsIndex = () => import( './views/assets/Index.vue')
const AssetsTransactions = () => import( './views/assets/Transactions.vue')
const DappIndex = () => import( './views/dapp/Index.vue')
const DappDetail = () => import( './views/dapp/Detail.vue')
const CreateDapp = () => import( './views/dapp/Create.vue')

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
                    path: 'assets',
                    name: 'assets',
                    component: AssetsIndex
                },
                {
                    path: 'assets/transactions',
                    name: 'assetsTransactions',
                    component: AssetsTransactions
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
                },
                {
					path: 'dapp',
					name: 'dapp',
					component: DappIndex
                },
                {
					path: 'dapp/detail/:hash',
					name: 'dappDetail',
					component: DappDetail
                },
                
                {
					path: 'dapp/create',
					name: 'createDapp',
					component: CreateDapp
				},
                
			]
		}
  	]
})
