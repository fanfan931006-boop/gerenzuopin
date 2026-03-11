// 类型定义
const AppStep = {
  HOME: 'HOME',
  WORK_DETAIL: 'WORK_DETAIL',
  ABOUT: 'ABOUT',
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_DASHBOARD: 'ADMIN_DASHBOARD',
  ADMIN_WORK_MANAGE: 'ADMIN_WORK_MANAGE',
  ADMIN_CATEGORY_MANAGE: 'ADMIN_CATEGORY_MANAGE'
};

// 色彩处理工具函数
const sortWorksByHue = (works) => {
  return [...works].sort((a, b) => a.hsbColor.h - b.hsbColor.h);
};

// Mock数据
const mockCategories = [
  { id: '1', name: '书籍装帧', order: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'UI设计', order: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', name: '海报设计', order: 3, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', name: '插画设计', order: 4, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
];

const mockWorks = [
  {
    id: '1',
    title: '现代诗集装帧设计',
    description: '为当代诗人设计的诗集装帧，采用极简风格，突出诗歌的韵律感和意境。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20poetry%20book%20cover%20design%20minimalist%20style&image_size=portrait_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20binding%20details%20modern%20design&image_size=portrait_4_3'
    ],
    category: '1',
    year: 2024,
    dominantColor: '#3b82f6',
    hsbColor: { h: 217, s: 0.75, b: 0.65 },
    viewCount: 120,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    title: '电子商务网站UI设计',
    description: '为小型电商平台设计的用户界面，注重用户体验和转化率优化。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=e-commerce%20website%20ui%20design%20modern%20clean&image_size=landscape_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20page%20design%20e-commerce&image_size=landscape_4_3'
    ],
    category: '2',
    year: 2024,
    dominantColor: '#10b981',
    hsbColor: { h: 160, s: 0.8, b: 0.47 },
    viewCount: 95,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '3',
    title: '音乐节海报设计',
    description: '为城市音乐节设计的系列海报，采用大胆的色彩和动感的构图。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20festival%20poster%20design%20vibrant%20colors&image_size=portrait_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=concert%20poster%20modern%20graphic%20design&image_size=portrait_4_3'
    ],
    category: '3',
    year: 2023,
    dominantColor: '#f97316',
    hsbColor: { h: 24, s: 0.9, b: 0.65 },
    viewCount: 150,
    createdAt: '2023-12-05T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '4',
    title: '儿童绘本插画',
    description: '为儿童绘本创作的系列插画，风格温暖明快，适合3-6岁儿童阅读。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20book%20illustration%20colorful%20friendly&image_size=portrait_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20storybook%20art%20whimsical%20style&image_size=portrait_4_3'
    ],
    category: '4',
    year: 2023,
    dominantColor: '#8b5cf6',
    hsbColor: { h: 260, s: 0.65, b: 0.6 },
    viewCount: 85,
    createdAt: '2023-11-20T00:00:00Z',
    updatedAt: '2023-11-20T00:00:00Z'
  },
  {
    id: '5',
    title: '企业年报设计',
    description: '为科技公司设计的年度报告，结合数据可视化和品牌元素。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=corporate%20annual%20report%20design%20professional&image_size=portrait_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20infographic%20design&image_size=portrait_4_3'
    ],
    category: '1',
    year: 2024,
    dominantColor: '#6366f1',
    hsbColor: { h: 239, s: 0.6, b: 0.55 },
    viewCount: 60,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    title: '移动应用UI设计',
    description: '为健康追踪应用设计的用户界面，注重数据清晰展示和用户交互体验。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=health%20tracking%20app%20ui%20design%20clean&image_size=portrait_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20dashboard%20design%20modern&image_size=portrait_4_3'
    ],
    category: '2',
    year: 2023,
    dominantColor: '#14b8a6',
    hsbColor: { h: 173, s: 0.7, b: 0.44 },
    viewCount: 110,
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z'
  }
];

const mockVisitStats = {
  totalVisits: 528,
  workVisits: {
    '1': 120,
    '2': 95,
    '3': 150,
    '4': 85,
    '5': 60,
    '6': 110
  },
  lastUpdated: new Date().toISOString()
};

const initialState = {
  step: AppStep.HOME,
  works: mockWorks,
  categories: mockCategories,
  selectedWorkId: null,
  selectedCategoryId: null,
  visitStats: mockVisitStats,
  isAdminLoggedIn: false,
  currentAdmin: null
};

// 导航组件
const Navigation = ({ state, updateState }) => {
  const handleCategoryClick = (categoryId) => {
    updateState({ selectedCategoryId: categoryId });
  };

  const handleAboutClick = () => {
    updateState({ step: AppStep.ABOUT });
  };

  const handleHomeClick = () => {
    updateState({ step: AppStep.HOME, selectedCategoryId: null });
  };

  const handleAdminClick = () => {
    updateState({ step: AppStep.ADMIN_LOGIN });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={handleHomeClick}
              className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
            >
              个人作品集
            </button>
          </div>
          <nav className="hidden md:flex space-x-8">
            <div className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar">
              {state.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.selectedCategoryId === category.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleAboutClick}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              关于我
            </button>
            <button
              onClick={handleAdminClick}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              管理后台
            </button>
          </nav>
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <i className="fa fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// 瀑布流组件
const WaterfallGrid = ({ works, onWorkClick }) => {
  // 按HSB色相排序作品，实现色彩过渡排版
  const sortedWorks = sortWorksByHue(works);

  return (
    <div className="masonry-grid">
      {sortedWorks.map(work => (
        <div
          key={work.id}
          className="masonry-item bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
          onClick={() => onWorkClick(work.id)}
          style={{ borderTop: `4px solid ${work.dominantColor}` }}
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={work.images[0]}
              alt={work.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{work.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{work.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{work.year}</span>
              <span className="flex items-center text-gray-500">
                <i className="fa fa-eye mr-1"></i>
                {work.viewCount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 作品详情页
const WorkDetailPage = ({ state, updateState }) => {
  const work = state.works.find(w => w.id === state.selectedWorkId);
  const category = state.categories.find(c => c.id === work?.category);

  if (!work) return null;

  const handleBackClick = () => {
    updateState({ step: AppStep.HOME, selectedWorkId: null });
  };

  return (
    <div className="min-h-screen bg-light">
      <Navigation state={state} updateState={updateState} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleBackClick}
          className="mb-6 px-4 py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          返回首页
        </button>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
            <div>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={work.images[0]}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {work.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {work.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${work.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{work.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {category?.name}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {work.year}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center">
                  <i className="fa fa-eye mr-1"></i>
                  {work.viewCount} 浏览
                </span>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">作品描述</h2>
                <p className="text-gray-600 leading-relaxed">{work.description}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">主色调</h2>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full shadow-md"
                    style={{ backgroundColor: work.dominantColor }}
                  ></div>
                  <span className="text-gray-600">{work.dominantColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// 关于我页面
const AboutPage = ({ state, updateState }) => {
  const handleBackClick = () => {
    updateState({ step: AppStep.HOME });
  };

  return (
    <div className="min-h-screen bg-light">
      <Navigation state={state} updateState={updateState} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleBackClick}
          className="mb-6 px-4 py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          返回首页
        </button>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
            <div>
              <div className="aspect-square overflow-hidden rounded-lg mb-6">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20graphic%20designer%20creative%20person&image_size=square"
                  alt="个人头像"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <i className="fa fa-envelope"></i>
                  </div>
                  <span className="text-gray-700">designer@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <i className="fa fa-phone"></i>
                  </div>
                  <span className="text-gray-700">+86 138 0013 8000</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <i className="fa fa-map-marker"></i>
                  </div>
                  <span className="text-gray-700">上海市</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">关于我</h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                我是一名专业的平面设计师，拥有5年的设计经验，专注于书籍装帧、UI设计、海报设计和插画创作。
                我热爱将创意转化为视觉作品，注重细节和用户体验，致力于为每个项目带来独特的视觉解决方案。
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                我的设计风格多变，能够根据项目需求调整创作方向，从极简主义到大胆的色彩运用，都能轻松驾驭。
                我相信好的设计不仅要美观，更要能够有效地传达信息和情感。
              </p>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">专业技能</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">平面设计</span>
                    <span className="text-sm text-gray-500">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">UI/UX设计</span>
                    <span className="text-sm text-gray-500">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">插画创作</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">3D建模</span>
                    <span className="text-sm text-gray-500">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// 登录页面
const AdminLoginPage = ({ state, updateState }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = () => {
    // 模拟登录验证
    if (username === 'admin' && password === 'password') {
      updateState({ 
        isAdminLoggedIn: true, 
        step: AppStep.ADMIN_DASHBOARD,
        currentAdmin: { id: '1', username: 'admin', password: 'hashed', createdAt: new Date().toISOString() }
      });
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleBackClick = () => {
    updateState({ step: AppStep.HOME });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">管理员登录</h1>
          <p className="text-gray-600">请输入您的账号密码</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-colors"
          >
            登录
          </button>
          <button
            onClick={handleBackClick}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

// 后台导航组件
const AdminNavigation = ({ state, updateState }) => {
  const handleDashboardClick = () => {
    updateState({ step: AppStep.ADMIN_DASHBOARD });
  };

  const handleWorkManageClick = () => {
    updateState({ step: AppStep.ADMIN_WORK_MANAGE });
  };

  const handleCategoryManageClick = () => {
    updateState({ step: AppStep.ADMIN_CATEGORY_MANAGE });
  };

  const handleLogoutClick = () => {
    updateState({ 
      isAdminLoggedIn: false, 
      step: AppStep.HOME,
      currentAdmin: null
    });
  };

  const handleBackToFrontClick = () => {
    updateState({ step: AppStep.HOME });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">管理后台</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <button
                onClick={handleDashboardClick}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
              >
                <i className="fa fa-dashboard text-gray-500"></i>
                <span>控制台</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleWorkManageClick}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
              >
                <i className="fa fa-picture-o text-gray-500"></i>
                <span>作品管理</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleCategoryManageClick}
                className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
              >
                <i className="fa fa-tags text-gray-500"></i>
                <span>分类管理</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <button
            onClick={handleBackToFrontClick}
            className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
          >
            <i className="fa fa-eye text-gray-500"></i>
            <span>查看前台</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors text-red-600"
          >
            <i className="fa fa-sign-out text-red-600"></i>
            <span>退出登录</span>
          </button>
        </div>
      </div>
      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {state.step === AppStep.ADMIN_DASHBOARD && '控制台'}
            {state.step === AppStep.ADMIN_WORK_MANAGE && '作品管理'}
            {state.step === AppStep.ADMIN_CATEGORY_MANAGE && '分类管理'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">欢迎，{state.currentAdmin?.username}</span>
          </div>
        </header>
        <main className="p-6">
          {/* 控制台页面 */}
          {state.step === AppStep.ADMIN_DASHBOARD && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">总作品数</h3>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <i className="fa fa-picture-o"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{state.works.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">总分类数</h3>
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                      <i className="fa fa-tags"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{state.categories.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">总访问量</h3>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="fa fa-eye"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{state.visitStats.totalVisits}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">作品浏览统计</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品名称</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览次数</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.works.map(work => {
                        const category = state.categories.find(c => c.id === work.category);
                        return (
                          <tr key={work.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{work.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{work.viewCount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category?.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{new Date(work.createdAt).toLocaleDateString()}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 作品管理页面 */}
          {state.step === AppStep.ADMIN_WORK_MANAGE && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">作品列表</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  <i className="fa fa-plus mr-1"></i>
                  新增作品
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品名称</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年份</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览次数</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.works.map(work => {
                        const category = state.categories.find(c => c.id === work.category);
                        return (
                          <tr key={work.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img className="h-10 w-10 rounded object-cover" src={work.images[0]} alt={work.title} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{work.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category?.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{work.year}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{work.viewCount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary hover:text-primary/80 mr-3">编辑</button>
                              <button className="text-red-600 hover:text-red-500">删除</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 分类管理页面 */}
          {state.step === AppStep.ADMIN_CATEGORY_MANAGE && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">分类列表</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  <i className="fa fa-plus mr-1"></i>
                  新增分类
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类名称</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品数</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.categories.map(category => {
                        const workCount = state.works.filter(work => work.category === category.id).length;
                        return (
                          <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category.order}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{workCount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary hover:text-primary/80 mr-3">编辑</button>
                              <button className="text-red-600 hover:text-red-500">删除</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// 主应用组件
const MainApp = () => {
  const [state, setState] = React.useState(initialState);

  const updateState = (updater) => {
    setState(prev => ({
      ...prev,
      ...updater
    }));
  };

  const handleWorkClick = (workId) => {
    // 增加浏览次数
    const updatedWorks = state.works.map(work => 
      work.id === workId ? { ...work, viewCount: work.viewCount + 1 } : work
    );
    const updatedVisitStats = {
      ...state.visitStats,
      workVisits: {
        ...state.visitStats.workVisits,
        [workId]: (state.visitStats.workVisits[workId] || 0) + 1
      }
    };
    updateState({
      works: updatedWorks,
      visitStats: updatedVisitStats,
      selectedWorkId: workId,
      step: AppStep.WORK_DETAIL
    });
  };

  // 根据当前步骤渲染不同页面
  const renderPage = () => {
    switch (state.step) {
      case AppStep.WORK_DETAIL:
        return <WorkDetailPage state={state} updateState={updateState} />;
      case AppStep.ABOUT:
        return <AboutPage state={state} updateState={updateState} />;
      case AppStep.ADMIN_LOGIN:
        return <AdminLoginPage state={state} updateState={updateState} />;
      case AppStep.ADMIN_DASHBOARD:
      case AppStep.ADMIN_WORK_MANAGE:
      case AppStep.ADMIN_CATEGORY_MANAGE:
        return <AdminNavigation state={state} updateState={updateState} />;
      case AppStep.HOME:
      default:
        const filteredWorks = state.selectedCategoryId 
          ? state.works.filter(work => work.category === state.selectedCategoryId)
          : state.works;
        return (
          <div className="min-h-screen bg-light">
            <Navigation state={state} updateState={updateState} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {state.selectedCategoryId 
                    ? state.categories.find(c => c.id === state.selectedCategoryId)?.name 
                    : '全部作品'
                  }
                </h1>
                <p className="text-gray-600">
                  共 {filteredWorks.length} 个作品
                </p>
              </div>
              <WaterfallGrid works={filteredWorks} onWorkClick={handleWorkClick} />
            </main>
            <footer className="bg-white border-t border-gray-200 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-600">© 2024 个人作品集. 保留所有权利.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 flex items-center">
                      <i className="fa fa-eye mr-1"></i>
                      总访问量: {state.visitStats.totalVisits}
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return renderPage();
};

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);
