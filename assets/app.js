/* ============================================
   三陶AI自习室 - 校区盈利模型测算工具
   核心应用逻辑
   ============================================ */

var App = {
  data: null,
  charts: {},
  STORAGE_KEY: 'santao_profit_calc_data',
  RECORDS_KEY: 'santao_profit_calc_records',
  DATA_VERSION: 2,

  /* ===== 默认数据 ===== */
  getDefaultData: function() {
    return this.getCityPresetData('prefecture3');
  },

  /* ===== 城市等级预设模板（按国家行政等级+商业层级划分） ===== */
  cityTemplates: {
    municipality: {
      label: '直辖市（北京/上海/天津/重庆）',
      desc: '行政级别最高，租金高客单价高，市场成熟竞争激烈',
      fixedCosts: [
        { name: '场地租金', amount: 18000 },
        { name: '物业管理费', amount: 1200 },
        { name: '水电费', amount: 2500 },
        { name: '网络宽带费', amount: 500 },
        { name: '装修摊销（60个月）', amount: 4000 },
        { name: '设备折旧（36个月）', amount: 2500 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 240000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 120000 },
        { name: '空调新风系统', amount: 45000 },
        { name: '监控安防系统', amount: 15000 },
        { name: 'AI学习系统软件授权', amount: 60000 },
        { name: '首批教材与学习耗材', amount: 12000 },
        { name: '证照办理及前期推广', amount: 10000 },
        { name: '流动资金储备', amount: 80000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 15000, socialInsurance: 3000, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 3, baseSalary: 8000, socialInsurance: 1800, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 2, baseSalary: 7000, socialInsurance: 1500, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 4, baseSalary: 6000, socialInsurance: 1200, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 800 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 500 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥15人', amount: 2000 },
        { name: '续费率超额奖', condition: '续费率≥70%', amount: 1500 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 60, hours: 80, enrollment: 40 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 50, hours: 240, enrollment: 20 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 80, hours: 20, enrollment: 25 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 250, hours: 8, enrollment: 15 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 150, hours: 16, enrollment: 20 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 6000, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 3000, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 800, remarks: '' },
        { name: '设备维护费', amount: 1200, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 4000, expectedLeads: 80, conversionRate: 12, avgCustomerValue: 5000 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 3000, expectedLeads: 60, conversionRate: 15, avgCustomerValue: 4500 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 1000, expectedLeads: 40, conversionRate: 20, avgCustomerValue: 4800 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 1500, expectedLeads: 30, conversionRate: 35, avgCustomerValue: 5000 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 2000, expectedLeads: 35, conversionRate: 15, avgCustomerValue: 4500 }
      ],
      operatingParams: { renewalRate: 65, refundRate: 8, campusArea: 250 }
    },

    provincial: {
      label: '省会城市（成都/武汉/西安/长沙等27市）',
      desc: '省级行政中心，租金适中，市场增速快，性价比最优',
      fixedCosts: [
        { name: '场地租金', amount: 12000 },
        { name: '物业管理费', amount: 800 },
        { name: '水电费', amount: 2000 },
        { name: '网络宽带费', amount: 400 },
        { name: '装修摊销（60个月）', amount: 3000 },
        { name: '设备折旧（36个月）', amount: 2000 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 180000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 100000 },
        { name: '空调新风系统', amount: 35000 },
        { name: '监控安防系统', amount: 12000 },
        { name: 'AI学习系统软件授权', amount: 55000 },
        { name: '首批教材与学习耗材', amount: 10000 },
        { name: '证照办理及前期推广', amount: 8000 },
        { name: '流动资金储备', amount: 60000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 12000, socialInsurance: 2400, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 2, baseSalary: 6500, socialInsurance: 1400, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 2, baseSalary: 5500, socialInsurance: 1200, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 3, baseSalary: 5000, socialInsurance: 1000, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 600 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 400 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥12人', amount: 1500 },
        { name: '续费率超额奖', condition: '续费率≥70%', amount: 1000 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 45, hours: 80, enrollment: 35 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 38, hours: 240, enrollment: 18 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 60, hours: 20, enrollment: 22 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 200, hours: 8, enrollment: 12 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 120, hours: 16, enrollment: 18 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 4500, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 2500, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 600, remarks: '' },
        { name: '设备维护费', amount: 1000, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 3000, expectedLeads: 65, conversionRate: 14, avgCustomerValue: 4000 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 2000, expectedLeads: 50, conversionRate: 18, avgCustomerValue: 3500 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 800, expectedLeads: 35, conversionRate: 22, avgCustomerValue: 3800 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 1200, expectedLeads: 25, conversionRate: 38, avgCustomerValue: 4000 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 1500, expectedLeads: 30, conversionRate: 16, avgCustomerValue: 3600 }
      ],
      operatingParams: { renewalRate: 62, refundRate: 9, campusArea: 220 }
    },

    prefecture2: {
      label: '地级市·二线（厦门/大连/宁波/合肥/福州等）',
      desc: '经济强市，消费力接近省会，租金偏高但客单价支撑力强',
      fixedCosts: [
        { name: '场地租金', amount: 10000 },
        { name: '物业管理费', amount: 600 },
        { name: '水电费', amount: 1800 },
        { name: '网络宽带费', amount: 350 },
        { name: '装修摊销（60个月）', amount: 2500 },
        { name: '设备折旧（36个月）', amount: 1800 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 150000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 90000 },
        { name: '空调新风系统', amount: 32000 },
        { name: '监控安防系统', amount: 11000 },
        { name: 'AI学习系统软件授权', amount: 52000 },
        { name: '首批教材与学习耗材', amount: 9000 },
        { name: '证照办理及前期推广', amount: 6000 },
        { name: '流动资金储备', amount: 55000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 10000, socialInsurance: 2000, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 2, baseSalary: 5500, socialInsurance: 1100, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 2, baseSalary: 5000, socialInsurance: 1000, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 3, baseSalary: 4500, socialInsurance: 900, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 550 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 350 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥12人', amount: 1200 },
        { name: '续费率超额奖', condition: '续费率≥70%', amount: 900 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 38, hours: 80, enrollment: 33 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 32, hours: 240, enrollment: 17 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 50, hours: 20, enrollment: 21 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 180, hours: 8, enrollment: 11 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 100, hours: 16, enrollment: 17 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 3500, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 2200, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 550, remarks: '' },
        { name: '设备维护费', amount: 900, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 2500, expectedLeads: 55, conversionRate: 16, avgCustomerValue: 3500 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 1800, expectedLeads: 45, conversionRate: 20, avgCustomerValue: 3000 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 600, expectedLeads: 32, conversionRate: 24, avgCustomerValue: 3200 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 1000, expectedLeads: 22, conversionRate: 40, avgCustomerValue: 3500 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 1200, expectedLeads: 28, conversionRate: 18, avgCustomerValue: 2800 }
      ],
      operatingParams: { renewalRate: 61, refundRate: 10, campusArea: 210 }
    },

    prefecture3: {
      label: '地级市·三线（绵阳/洛阳/芜湖/宜昌/株洲等）',
      desc: '地级行政区，租金适中客单价合理，回本周期较短',
      fixedCosts: [
        { name: '场地租金', amount: 8000 },
        { name: '物业管理费', amount: 500 },
        { name: '水电费', amount: 1500 },
        { name: '网络宽带费', amount: 300 },
        { name: '装修摊销（60个月）', amount: 2000 },
        { name: '设备折旧（36个月）', amount: 1500 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 120000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 80000 },
        { name: '空调新风系统', amount: 30000 },
        { name: '监控安防系统', amount: 10000 },
        { name: 'AI学习系统软件授权', amount: 50000 },
        { name: '首批教材与学习耗材', amount: 8000 },
        { name: '证照办理及前期推广', amount: 5000 },
        { name: '流动资金储备', amount: 50000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 8000, socialInsurance: 1500, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 2, baseSalary: 5000, socialInsurance: 1000, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 2, baseSalary: 4500, socialInsurance: 900, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 3, baseSalary: 4000, socialInsurance: 800, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 500 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 300 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥10人', amount: 1000 },
        { name: '续费率超额奖', condition: '续费率≥70%', amount: 800 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 30, hours: 80, enrollment: 30 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 25, hours: 240, enrollment: 15 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 40, hours: 20, enrollment: 20 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 150, hours: 8, enrollment: 10 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 80, hours: 16, enrollment: 15 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 3000, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 2000, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 500, remarks: '' },
        { name: '设备维护费', amount: 800, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 2000, expectedLeads: 50, conversionRate: 15, avgCustomerValue: 3000 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 1500, expectedLeads: 40, conversionRate: 20, avgCustomerValue: 2500 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 500, expectedLeads: 30, conversionRate: 25, avgCustomerValue: 2800 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 800, expectedLeads: 20, conversionRate: 40, avgCustomerValue: 3000 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 1000, expectedLeads: 25, conversionRate: 18, avgCustomerValue: 2600 }
      ],
      operatingParams: { renewalRate: 60, refundRate: 10, campusArea: 200 }
    },

    prefecture4: {
      label: '地级市·四线（毕节/昭通/安顺/百色/河池等）',
      desc: '地级行政区经济较弱，租金低竞争小，投入少但客单价偏低',
      fixedCosts: [
        { name: '场地租金', amount: 5000 },
        { name: '物业管理费', amount: 350 },
        { name: '水电费', amount: 1000 },
        { name: '网络宽带费', amount: 250 },
        { name: '装修摊销（60个月）', amount: 1500 },
        { name: '设备折旧（36个月）', amount: 1000 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 80000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 60000 },
        { name: '空调新风系统', amount: 20000 },
        { name: '监控安防系统', amount: 7000 },
        { name: 'AI学习系统软件授权', amount: 45000 },
        { name: '首批教材与学习耗材', amount: 5000 },
        { name: '证照办理及前期推广', amount: 3000 },
        { name: '流动资金储备', amount: 30000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 6000, socialInsurance: 1000, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 1, baseSalary: 4000, socialInsurance: 700, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 1, baseSalary: 3500, socialInsurance: 600, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 2, baseSalary: 3000, socialInsurance: 500, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 350 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 200 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥8人', amount: 700 },
        { name: '续费率超额奖', condition: '续费率≥65%', amount: 500 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 20, hours: 80, enrollment: 25 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 16, hours: 240, enrollment: 12 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 28, hours: 20, enrollment: 15 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 100, hours: 8, enrollment: 8 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 60, hours: 16, enrollment: 12 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 1800, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 1200, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 300, remarks: '' },
        { name: '设备维护费', amount: 500, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 1200, expectedLeads: 35, conversionRate: 18, avgCustomerValue: 2000 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 800, expectedLeads: 30, conversionRate: 22, avgCustomerValue: 1800 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 400, expectedLeads: 22, conversionRate: 28, avgCustomerValue: 2000 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 500, expectedLeads: 15, conversionRate: 45, avgCustomerValue: 2000 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 600, expectedLeads: 18, conversionRate: 20, avgCustomerValue: 1800 }
      ],
      operatingParams: { renewalRate: 57, refundRate: 12, campusArea: 170 }
    },

    county: {
      label: '县级市/县（各县级市及县）',
      desc: '县级行政区，租金低竞争小，投入少回本最快',
      fixedCosts: [
        { name: '场地租金', amount: 3000 },
        { name: '物业管理费', amount: 200 },
        { name: '水电费', amount: 600 },
        { name: '网络宽带费', amount: 150 },
        { name: '装修摊销（60个月）', amount: 1000 },
        { name: '设备折旧（36个月）', amount: 800 }
      ],
      initialInvestment: [
        { name: '装修改造', amount: 50000 },
        { name: '智能自习设备（智能桌椅/平板）', amount: 40000 },
        { name: '空调新风系统', amount: 15000 },
        { name: '监控安防系统', amount: 5000 },
        { name: 'AI学习系统软件授权', amount: 40000 },
        { name: '首批教材与学习耗材', amount: 3000 },
        { name: '证照办理及前期推广', amount: 2000 },
        { name: '流动资金储备', amount: 20000 }
      ],
      staffing: [
        { name: '校区校长', headcount: 1, baseSalary: 5000, socialInsurance: 800, commissionType: 'none', commissionValue: 0 },
        { name: '课程顾问', headcount: 1, baseSalary: 3500, socialInsurance: 600, commissionType: 'percent', commissionValue: 5 },
        { name: '学管师', headcount: 1, baseSalary: 3000, socialInsurance: 500, commissionType: 'percent', commissionValue: 3 },
        { name: '辅导老师', headcount: 2, baseSalary: 2500, socialInsurance: 400, commissionType: 'none', commissionValue: 0 }
      ],
      commissionItems: [
        { name: '新签招生提成', type: 'fixed', baseAmount: 0, value: 300 },
        { name: '续费提成', type: 'percent', baseAmount: 0, value: 3 },
        { name: '满班率奖金', type: 'fixed', baseAmount: 0, value: 150 }
      ],
      bonusItems: [
        { name: '月度招生达标奖', condition: '月招生≥6人', amount: 500 },
        { name: '续费率超额奖', condition: '续费率≥60%', amount: 400 }
      ],
      courses: [
        { name: '月卡（全日自习）', type: '自习卡', pricePerHour: 15, hours: 80, enrollment: 20 },
        { name: '季卡（全日自习）', type: '自习卡', pricePerHour: 12, hours: 240, enrollment: 10 },
        { name: '次卡（按时段）', type: '自习卡', pricePerHour: 20, hours: 20, enrollment: 12 },
        { name: 'AI一对一辅导', type: 'AI辅导', pricePerHour: 80, hours: 8, enrollment: 6 },
        { name: '周末小班提升课', type: '特色课', pricePerHour: 50, hours: 16, enrollment: 10 }
      ],
      otherExpenses: [
        { name: '市场推广费', amount: 1200, remarks: '线上线下广告' },
        { name: '教材与学习耗材', amount: 1000, remarks: '学习资料印刷' },
        { name: '办公用品费', amount: 200, remarks: '' },
        { name: '设备维护费', amount: 300, remarks: '' }
      ],
      channels: [
        { name: '抖音/快手信息流', type: '线上推广', monthlyInvestment: 800, expectedLeads: 30, conversionRate: 20, avgCustomerValue: 1500 },
        { name: '地推活动', type: '地推活动', monthlyInvestment: 500, expectedLeads: 25, conversionRate: 25, avgCustomerValue: 1200 },
        { name: '周边学校合作', type: '校园合作', monthlyInvestment: 300, expectedLeads: 20, conversionRate: 30, avgCustomerValue: 1500 },
        { name: '老带新转介绍', type: '转介绍', monthlyInvestment: 300, expectedLeads: 10, conversionRate: 50, avgCustomerValue: 1500 },
        { name: '社区异业合作', type: '异业合作', monthlyInvestment: 500, expectedLeads: 15, conversionRate: 22, avgCustomerValue: 1300 }
      ],
      operatingParams: { renewalRate: 55, refundRate: 15, campusArea: 150 }
    }
  },

  /* ===== 获取城市预设数据 ===== */
  getCityPresetData: function(tier) {
    var template = this.cityTemplates[tier] || this.cityTemplates.prefecture3;
    return JSON.parse(JSON.stringify({
      fixedCosts: template.fixedCosts,
      initialInvestment: template.initialInvestment,
      staffing: template.staffing,
      commissionItems: template.commissionItems,
      bonusItems: template.bonusItems,
      courses: template.courses,
      otherExpenses: template.otherExpenses,
      channels: template.channels,
      operatingParams: template.operatingParams
    }));
  },

  /* ===== 应用城市预设模板 ===== */
  applyCityPreset: function(tier) {
    if (!this.cityTemplates[tier]) return;
    if (!confirm('切换城市等级将覆盖当前所有数据，确定继续吗？\n\n建议先导出JSON备份当前数据。')) return;
    this.data = this.getCityPresetData(tier);
    this.data._cityTier = tier;
    this.saveToLocalStorage();
    this.renderAll();
    // 更新城市选择器显示
    var selector = document.getElementById('city-preset-selector');
    if (selector) selector.value = tier;
    var desc = document.getElementById('city-preset-desc');
    if (desc) desc.textContent = this.cityTemplates[tier].desc;
  },

  /* ===== 工具函数 ===== */
  fmt: function(v) {
    if (v === 0 || v === undefined || v === null || isNaN(v)) return '¥0';
    return '¥' + Math.round(v).toLocaleString('zh-CN');
  },
  fmtNum: function(v, decimals) {
    decimals = decimals || 0;
    if (v === 0 || v === undefined || v === null || isNaN(v)) return '0';
    return Number(v).toFixed(decimals);
  },
  fmtPct: function(v, decimals) {
    decimals = decimals || 1;
    if (v === 0 || v === undefined || v === null || isNaN(v)) return '0.0%';
    return Number(v).toFixed(decimals) + '%';
  },
  esc: function(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },
  numVal: function(v) {
    v = parseFloat(v);
    return isNaN(v) ? 0 : v;
  },

  /* ===== 初始化 ===== */
  init: function() {
    this.data = this.loadFromLocalStorage() || this.getDefaultData();
    this.bindTabs();
    this.bindEvents();
    this.renderAll();
    this.updateCitySelector();
  },

  /* ===== 更新城市选择器状态 ===== */
  updateCitySelector: function() {
    var tier = this.data._cityTier || 'prefecture3';
    var selector = document.getElementById('city-preset-selector');
    if (selector) selector.value = tier;
    var desc = document.getElementById('city-preset-desc');
    if (desc && this.cityTemplates[tier]) desc.textContent = this.cityTemplates[tier].desc;
  },

  /* ===== Tab 切换 ===== */
  bindTabs: function() {
    var self = this;
    var btns = document.querySelectorAll('.tab-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.getAttribute('data-tab');
        btns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
        document.getElementById('tab-' + tab).classList.add('active');
        // Always re-render the target tab to pick up latest cross-module data
        self.renderCurrentTable();
      });
    });
  },

  /* ===== 事件绑定 ===== */
  bindEvents: function() {
    var self = this;
    // Delegate input changes on all table containers
    var containers = [
      'fixedCosts-table', 'initialInvestment-table', 'staffing-table',
      'commissions-section', 'courses-table', 'otherExpenses-table',
      'channels-table', 'params-grid'
    ];
    containers.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function(e) {
          self.handleInput(e);
        });
        el.addEventListener('change', function(e) {
          self.handleInput(e);
        });
        el.addEventListener('click', function(e) {
          self.handleClick(e);
        });
      }
    });
  },

  handleInput: function(e) {
    var target = e.target;
    var field = target.getAttribute('data-field');
    var type = target.getAttribute('data-type');
    var idx = parseInt(target.getAttribute('data-idx'));
    if (field === null || type === null) return;

    if (type === 'operatingParams') {
      this.data.operatingParams[field] = this.numVal(target.value);
    } else {
      var arr = this.data[type];
      if (!arr || isNaN(idx) || idx >= arr.length) return;
      if (target.type === 'number' || target.classList.contains('input-num')) {
        arr[idx][field] = this.numVal(target.value);
      } else {
        arr[idx][field] = target.value;
      }
    }
    this.saveToLocalStorage();

    if (e.type === 'input') {
      // Real-time: update only calculated cells in the current row (no re-render, no focus loss)
      this.updateRowCalc(type, idx);
      // Also update summary tables if present
      this.updateSummaryIfPresent(type);
    } else if (e.type === 'change') {
      // On blur: full re-render to handle structural changes (dropdowns, etc.)
      this.renderCurrentTable();
    }
  },

  /* ===== 实时更新当前行的计算单元格 ===== */
  updateRowCalc: function(type, idx) {
    var input = document.querySelector('[data-type="' + type + '"][data-idx="' + idx + '"]');
    if (!input) return;
    var row = input.closest('tr');
    if (!row) return;
    var cells = row.querySelectorAll('.calc-cell');

    if (type === 'courses') {
      var c = this.data.courses[idx];
      var revenue = (c.pricePerHour || 0) * (c.hours || 0) * (c.enrollment || 0);
      if (cells[0]) cells[0].textContent = this.fmt(revenue);
    } else if (type === 'staffing') {
      var s = this.data.staffing[idx];
      var results = this.calculate();
      var commission = this.calcStaffingCommission(s, results.monthlyGrossRevenue);
      var subtotal = (s.headcount || 0) * ((s.baseSalary || 0) + (s.socialInsurance || 0)) + commission;
      var commissionLabel = s.commissionType === 'none' ? '—' :
        (s.commissionType === 'fixed' ? this.fmt(s.commissionValue) : this.fmt(commission));
      if (cells[0]) cells[0].textContent = commissionLabel;
      if (cells[1]) cells[1].textContent = this.fmt(subtotal);
    } else if (type === 'commissionItems') {
      var item = this.data.commissionItems[idx];
      var results2 = this.calculate();
      var comm = this.calcCommissionItem(item, results2.monthlyGrossRevenue);
      if (cells[0]) cells[0].textContent = this.fmt(comm);
    } else if (type === 'channels') {
      var ch = this.data.channels[idx];
      var conversions = (ch.expectedLeads || 0) * (ch.conversionRate || 0) / 100;
      var output = conversions * (ch.avgCustomerValue || 0);
      var roi = (ch.monthlyInvestment || 0) > 0 ? (output / ch.monthlyInvestment * 100) : 0;
      if (cells[0]) cells[0].textContent = this.fmtNum(conversions, 1);
      if (cells[1]) cells[1].textContent = this.fmt(output);
      if (cells[2]) { cells[2].textContent = this.fmtNum(roi, 1) + '%'; cells[2].className = 'calc-cell ' + (roi >= 100 ? '' : 'muted'); }
    }
  },

  /* ===== 更新汇总表（获客渠道汇总） ===== */
  updateSummaryIfPresent: function(type) {
    if (type === 'channels') {
      var summaryTable = document.querySelector('.summary-table tbody tr');
      if (!summaryTable) return;
      var totals = { investment: 0, leads: 0, conversions: 0, output: 0 };
      this.data.channels.forEach(function(c) {
        totals.investment += c.monthlyInvestment || 0;
        totals.leads += c.expectedLeads || 0;
        totals.conversions += (c.expectedLeads || 0) * (c.conversionRate || 0) / 100;
        totals.output += (c.expectedLeads || 0) * (c.conversionRate || 0) / 100 * (c.avgCustomerValue || 0);
      });
      var totalROI = totals.investment > 0 ? (totals.output / totals.investment * 100) : 0;
      var cells = summaryTable.querySelectorAll('td');
      if (cells.length >= 6) {
        cells[1].textContent = this.fmt(totals.investment);
        cells[2].textContent = this.fmtNum(totals.leads, 0);
        cells[3].textContent = this.fmtNum(totals.conversions, 1);
        cells[4].textContent = this.fmt(totals.output);
        cells[5].textContent = this.fmtNum(totalROI, 1) + '%';
      }
    }
  },

  handleClick: function(e) {
    var target = e.target;
    var action = target.getAttribute('data-action');
    if (!action) return;
    var type = target.getAttribute('data-type');
    var idx = parseInt(target.getAttribute('data-idx'));

    if (action === 'delete' && !isNaN(idx)) {
      var arr = this.data[type];
      if (arr && idx < arr.length) {
        arr.splice(idx, 1);
        this.saveToLocalStorage();
        this.renderCurrentTable();
        this.showToast('已删除一行');
      }
    } else if (action === 'add') {
      this.addRow(type);
    }
  },

  addRow: function(type) {
    var defaults = {
      fixedCosts: { name: '', amount: 0 },
      initialInvestment: { name: '', amount: 0 },
      staffing: { name: '', headcount: 0, baseSalary: 0, socialInsurance: 0, commissionType: 'none', commissionValue: 0 },
      commissionItems: { name: '', type: 'fixed', baseAmount: 0, value: 0 },
      bonusItems: { name: '', condition: '', amount: 0 },
      courses: { name: '', type: '自习卡', pricePerHour: 0, hours: 0, enrollment: 0 },
      otherExpenses: { name: '', amount: 0, remarks: '' },
      channels: { name: '', type: '线上推广', monthlyInvestment: 0, expectedLeads: 0, conversionRate: 0, avgCustomerValue: 0 }
    };
    if (defaults[type]) {
      this.data[type].push(defaults[type]);
      this.saveToLocalStorage();
      this.renderCurrentTable();
    }
  },

  renderCurrentTable: function() {
    var activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;
    var tab = activeTab.getAttribute('data-tab');
    switch(tab) {
      case 'fixedCosts': this.renderFixedCosts(); break;
      case 'initialInvestment': this.renderInitialInvestment(); break;
      case 'staffing': this.renderStaffing(); break;
      case 'commissions': this.renderCommissions(); break;
      case 'courses': this.renderCourses(); break;
      case 'otherExpenses': this.renderOtherExpenses(); break;
      case 'channels': this.renderChannels(); break;
      case 'operatingParams': this.renderOperatingParams(); break;
      case 'profitAnalysis': this.renderProfitAnalysis(); break;
    }
  },

  /* ===== 渲染所有 ===== */
  renderAll: function() {
    this.renderFixedCosts();
    this.renderInitialInvestment();
    this.renderStaffing();
    this.renderCommissions();
    this.renderCourses();
    this.renderOtherExpenses();
    this.renderChannels();
    this.renderOperatingParams();
  },

  /* ===== 固定成本 ===== */
  renderFixedCosts: function() {
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>项目名称</th><th>月均金额（元）</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.fixedCosts.forEach(function(item, i) {
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="项目名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="fixedCosts" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="月均金额" class="input-cell"><input type="number" class="input-num" value="' + item.amount + '" data-type="fixedCosts" data-idx="' + i + '" data-field="amount" min="0"></td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="fixedCosts" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="fixedCosts">+ 添加项目</button>';
    document.getElementById('fixedCosts-table').innerHTML = html;
  },

  /* ===== 初始投资 ===== */
  renderInitialInvestment: function() {
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>投资项目</th><th>金额（元）</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.initialInvestment.forEach(function(item, i) {
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="投资项目" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="initialInvestment" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="金额" class="input-cell"><input type="number" class="input-num" value="' + item.amount + '" data-type="initialInvestment" data-idx="' + i + '" data-field="amount" min="0"></td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="initialInvestment" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="initialInvestment">+ 添加投资项目</button>';
    document.getElementById('initialInvestment-table').innerHTML = html;
  },

  /* ===== 人员配置 ===== */
  renderStaffing: function() {
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>岗位名称</th><th>人数</th><th>基本工资（月/人）</th><th>社保公积金（月/人）</th><th>提成方式</th><th>提成值</th><th>月均提成</th><th>岗位小计</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    var results = this.calculate();
    this.data.staffing.forEach(function(item, i) {
      var commission = this.calcStaffingCommission(item, results.monthlyGrossRevenue);
      var subtotal = item.headcount * (item.baseSalary + item.socialInsurance) + commission;
      var commissionLabel = item.commissionType === 'none' ? '—' :
        (item.commissionType === 'fixed' ? this.fmt(item.commissionValue) : this.fmt(commission));
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="岗位名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="staffing" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="人数" class="input-cell"><input type="number" class="input-num" value="' + item.headcount + '" data-type="staffing" data-idx="' + i + '" data-field="headcount" min="0"></td>' +
        '<td data-label="基本工资" class="input-cell"><input type="number" class="input-num" value="' + item.baseSalary + '" data-type="staffing" data-idx="' + i + '" data-field="baseSalary" min="0"></td>' +
        '<td data-label="社保公积金" class="input-cell"><input type="number" class="input-num" value="' + item.socialInsurance + '" data-type="staffing" data-idx="' + i + '" data-field="socialInsurance" min="0"></td>' +
        '<td data-label="提成方式" class="input-cell"><select class="input-select" data-type="staffing" data-idx="' + i + '" data-field="commissionType">' +
          '<option value="none"' + (item.commissionType==='none'?' selected':'') + '>无提成</option>' +
          '<option value="fixed"' + (item.commissionType==='fixed'?' selected':'') + '>固定金额</option>' +
          '<option value="percent"' + (item.commissionType==='percent'?' selected':'') + '>按比例</option>' +
        '</select></td>' +
        '<td data-label="提成值" class="input-cell"><input type="number" class="input-num" value="' + item.commissionValue + '" data-type="staffing" data-idx="' + i + '" data-field="commissionValue" min="0"' + (item.commissionType==='none'?' disabled':'') + '></td>' +
        '<td class="calc-cell" data-label="月均提成">' + commissionLabel + '</td>' +
        '<td class="calc-cell" data-label="岗位小计">' + this.fmt(subtotal) + '</td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="staffing" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="staffing">+ 添加岗位</button>';
    document.getElementById('staffing-table').innerHTML = html;
  },

  calcStaffingCommission: function(item, grossRevenue) {
    if (item.commissionType === 'none') return 0;
    if (item.commissionType === 'fixed') return item.commissionValue || 0;
    if (item.commissionType === 'percent') return (grossRevenue || 0) * (item.commissionValue || 0) / 100;
    return 0;
  },

  /* ===== 提成奖金 ===== */
  renderCommissions: function() {
    var results = this.calculate();
    var html = '<div class="sub-title">提成项目</div>';
    html += '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>提成项目名称</th><th>提成方式</th><th>提成基数（元）</th><th>提成值</th><th>月均提成金额</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.commissionItems.forEach(function(item, i) {
      var commission = this.calcCommissionItem(item, results.monthlyGrossRevenue);
      var valueLabel = item.type === 'fixed' ? '元' : '%';
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="项目名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="commissionItems" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="提成方式" class="input-cell"><select class="input-select" data-type="commissionItems" data-idx="' + i + '" data-field="type">' +
          '<option value="fixed"' + (item.type==='fixed'?' selected':'') + '>固定金额</option>' +
          '<option value="percent"' + (item.type==='percent'?' selected':'') + '>按比例</option>' +
        '</select></td>' +
        '<td data-label="提成基数" class="input-cell"><input type="number" class="input-num" value="' + item.baseAmount + '" data-type="commissionItems" data-idx="' + i + '" data-field="baseAmount" min="0"' + (item.type==='fixed'?' disabled':'') + '></td>' +
        '<td data-label="提成值" class="input-cell"><input type="number" class="input-num" value="' + item.value + '" data-type="commissionItems" data-idx="' + i + '" data-field="value" min="0"></td>' +
        '<td class="calc-cell" data-label="月均提成">' + this.fmt(commission) + '</td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="commissionItems" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="commissionItems">+ 添加提成项目</button>';

    html += '<div class="sub-title">奖金项目</div>';
    html += '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>奖金项目名称</th><th>发放条件</th><th>金额（元）</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.bonusItems.forEach(function(item, i) {
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="项目名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="bonusItems" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="发放条件" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.condition) + '" data-type="bonusItems" data-idx="' + i + '" data-field="condition" placeholder="如：月招生≥20人"></td>' +
        '<td data-label="金额" class="input-cell"><input type="number" class="input-num" value="' + item.amount + '" data-type="bonusItems" data-idx="' + i + '" data-field="amount" min="0"></td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="bonusItems" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="bonusItems">+ 添加奖金项目</button>';
    document.getElementById('commissions-section').innerHTML = html;
  },

  calcCommissionItem: function(item, grossRevenue) {
    if (item.type === 'fixed') return item.value || 0;
    if (item.type === 'percent') {
      var base = item.baseAmount || 0;
      if (base === 0) base = grossRevenue || 0;
      return base * (item.value || 0) / 100;
    }
    return 0;
  },

  /* ===== 课程产品 ===== */
  renderCourses: function() {
    var types = ['自习卡', 'AI辅导', '特色课', '辅导', '自习', '特色'];
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>课程名称</th><th>课程类型</th><th>单课时价格（元）</th><th>课时数</th><th>预计招生人数</th><th>课程收入（元）</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.courses.forEach(function(item, i) {
      var revenue = (item.pricePerHour || 0) * (item.hours || 0) * (item.enrollment || 0);
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="课程名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="courses" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="课程类型" class="input-cell"><select class="input-select" data-type="courses" data-idx="' + i + '" data-field="type">' +
          types.map(function(t) { return '<option value="' + t + '"' + (item.type===t?' selected':'') + '>' + t + '</option>'; }).join('') +
        '</select></td>' +
        '<td data-label="单课时价格" class="input-cell"><input type="number" class="input-num" value="' + item.pricePerHour + '" data-type="courses" data-idx="' + i + '" data-field="pricePerHour" min="0"></td>' +
        '<td data-label="课时数" class="input-cell"><input type="number" class="input-num" value="' + item.hours + '" data-type="courses" data-idx="' + i + '" data-field="hours" min="0"></td>' +
        '<td data-label="预计招生" class="input-cell"><input type="number" class="input-num" value="' + item.enrollment + '" data-type="courses" data-idx="' + i + '" data-field="enrollment" min="0"></td>' +
        '<td class="calc-cell" data-label="课程收入">' + this.fmt(revenue) + '</td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="courses" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="courses">+ 添加课程</button>';
    document.getElementById('courses-table').innerHTML = html;
  },

  /* ===== 其他支出 ===== */
  renderOtherExpenses: function() {
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>支出项目名称</th><th>月均金额（元）</th><th>备注</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    this.data.otherExpenses.forEach(function(item, i) {
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="项目名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="otherExpenses" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="月均金额" class="input-cell"><input type="number" class="input-num" value="' + item.amount + '" data-type="otherExpenses" data-idx="' + i + '" data-field="amount" min="0"></td>' +
        '<td data-label="备注" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.remarks) + '" data-type="otherExpenses" data-idx="' + i + '" data-field="remarks"></td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="otherExpenses" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="otherExpenses">+ 添加支出项</button>';
    document.getElementById('otherExpenses-table').innerHTML = html;
  },

  /* ===== 获客渠道 ===== */
  renderChannels: function() {
    var types = ['线上推广', '地推活动', '校园合作', '转介绍', '异业合作', '其他'];
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th class="col-num">#</th><th>渠道名称</th><th>渠道类型</th><th>月均投入金额</th><th>预计月均获客数</th><th>转化率%</th><th>实际成交人数</th><th>客单价</th><th>月均产出金额</th><th>ROI</th><th class="col-action">操作</th>' +
      '</tr></thead><tbody>';
    var totals = { investment: 0, leads: 0, conversions: 0, output: 0 };
    this.data.channels.forEach(function(item, i) {
      var conversions = (item.expectedLeads || 0) * (item.conversionRate || 0) / 100;
      var output = conversions * (item.avgCustomerValue || 0);
      var roi = (item.monthlyInvestment || 0) > 0 ? (output / item.monthlyInvestment * 100) : 0;
      totals.investment += item.monthlyInvestment || 0;
      totals.leads += item.expectedLeads || 0;
      totals.conversions += conversions;
      totals.output += output;
      html += '<tr>' +
        '<td class="col-num">' + (i+1) + '</td>' +
        '<td data-label="渠道名称" class="input-cell"><input type="text" class="input-text" value="' + this.esc(item.name) + '" data-type="channels" data-idx="' + i + '" data-field="name"></td>' +
        '<td data-label="渠道类型" class="input-cell"><select class="input-select" data-type="channels" data-idx="' + i + '" data-field="type">' +
          types.map(function(t) { return '<option value="' + t + '"' + (item.type===t?' selected':'') + '>' + t + '</option>'; }).join('') +
        '</select></td>' +
        '<td data-label="月均投入" class="input-cell"><input type="number" class="input-num" value="' + item.monthlyInvestment + '" data-type="channels" data-idx="' + i + '" data-field="monthlyInvestment" min="0"></td>' +
        '<td data-label="预计获客数" class="input-cell"><input type="number" class="input-num" value="' + item.expectedLeads + '" data-type="channels" data-idx="' + i + '" data-field="expectedLeads" min="0"></td>' +
        '<td data-label="转化率%" class="input-cell"><input type="number" class="input-num" value="' + item.conversionRate + '" data-type="channels" data-idx="' + i + '" data-field="conversionRate" min="0" max="100"></td>' +
        '<td class="calc-cell" data-label="实际成交">' + this.fmtNum(conversions, 1) + '</td>' +
        '<td data-label="客单价" class="input-cell"><input type="number" class="input-num" value="' + item.avgCustomerValue + '" data-type="channels" data-idx="' + i + '" data-field="avgCustomerValue" min="0"></td>' +
        '<td class="calc-cell" data-label="月均产出">' + this.fmt(output) + '</td>' +
        '<td class="calc-cell ' + (roi >= 100 ? '' : 'muted') + '" data-label="ROI">' + this.fmtNum(roi, 1) + '%</td>' +
        '<td class="col-action" data-label="操作"><button class="btn-del" data-action="delete" data-type="channels" data-idx="' + i + '">删除</button></td>' +
        '</tr>';
    }, this);
    html += '</tbody></table></div>';
    html += '<button class="btn btn-add" data-action="add" data-type="channels">+ 添加渠道</button>';

    // Summary
    var totalROI = totals.investment > 0 ? (totals.output / totals.investment * 100) : 0;
    html += '<table class="summary-table"><thead><tr>' +
      '<th>汇总项</th><th>总投入金额</th><th>总获客数</th><th>总成交人数</th><th>总产出金额</th><th>综合ROI</th>' +
      '</tr></thead><tbody><tr>' +
      '<td>合计</td><td>' + this.fmt(totals.investment) + '</td><td>' + this.fmtNum(totals.leads, 0) + '</td>' +
      '<td>' + this.fmtNum(totals.conversions, 1) + '</td><td>' + this.fmt(totals.output) + '</td>' +
      '<td>' + this.fmtNum(totalROI, 1) + '%</td>' +
      '</tr></tbody></table>';

    document.getElementById('channels-table').innerHTML = html;
  },

  /* ===== 经营参数 ===== */
  renderOperatingParams: function() {
    var p = this.data.operatingParams;
    var html = '<div class="param-card">' +
      '<label>学员续费率（%）</label>' +
      '<div class="hint">到期学员续费比例，AI自习室行业参考值：50%-70%</div>' +
      '<input type="number" class="input-num" value="' + p.renewalRate + '" data-type="operatingParams" data-field="renewalRate" min="0" max="100">' +
      '</div>';
    html += '<div class="param-card">' +
      '<label>退费率（%）</label>' +
      '<div class="hint">学员退费比例，将从总收入中扣除，行业参考值：5%-15%</div>' +
      '<input type="number" class="input-num" value="' + p.refundRate + '" data-type="operatingParams" data-field="refundRate" min="0" max="100">' +
      '</div>';
    html += '<div class="param-card">' +
      '<label>校区面积（m²）</label>' +
      '<div class="hint">用于计算坪效（每平方米产出），行业参考值：150-300m²</div>' +
      '<input type="number" class="input-num" value="' + p.campusArea + '" data-type="operatingParams" data-field="campusArea" min="0">' +
      '</div>';
    document.getElementById('params-grid').innerHTML = html;
  },

  /* ===== 计算引擎 ===== */
  calculate: function() {
    var d = this.data;
    var p = d.operatingParams;

    // Revenue (normalized to monthly)
    var monthlyGrossRevenue = 0;
    var totalEnrollment = 0;
    d.courses.forEach(function(c) {
      var rev = (c.pricePerHour || 0) * (c.hours || 0) * (c.enrollment || 0);
      // Normalize to monthly: quarter cards divided by 3
      if (c.name && c.name.indexOf('季卡') >= 0) {
        rev = rev / 3;
      }
      monthlyGrossRevenue += rev;
      totalEnrollment += c.enrollment || 0;
    });
    // Net revenue after refund deduction (renewal rate is a sustainability metric, not revenue addition)
    var monthlyNetRevenue = monthlyGrossRevenue * (1 - (p.refundRate || 0) / 100);
    var annualRevenue = monthlyNetRevenue * 12;

    // Staffing cost
    var monthlyStaffingCost = 0;
    var totalHeadcount = 0;
    d.staffing.forEach(function(s) {
      var commission = this.calcStaffingCommission(s, monthlyGrossRevenue);
      var cost = (s.headcount || 0) * ((s.baseSalary || 0) + (s.socialInsurance || 0)) + commission;
      monthlyStaffingCost += cost;
      totalHeadcount += s.headcount || 0;
    }, this);

    // Commission items
    var monthlyCommissionItems = 0;
    d.commissionItems.forEach(function(item) {
      monthlyCommissionItems += this.calcCommissionItem(item, monthlyGrossRevenue);
    }, this);

    // Bonus items
    var monthlyBonusItems = 0;
    d.bonusItems.forEach(function(item) {
      monthlyBonusItems += item.amount || 0;
    });

    // Other expenses
    var monthlyOtherExpenses = 0;
    d.otherExpenses.forEach(function(item) {
      monthlyOtherExpenses += item.amount || 0;
    });

    // Channel costs
    var monthlyChannelCosts = 0;
    var monthlyNewStudents = 0;
    d.channels.forEach(function(c) {
      monthlyChannelCosts += c.monthlyInvestment || 0;
      monthlyNewStudents += (c.expectedLeads || 0) * (c.conversionRate || 0) / 100;
    });

    // Fixed costs
    var monthlyFixedCosts = 0;
    d.fixedCosts.forEach(function(item) {
      monthlyFixedCosts += item.amount || 0;
    });

    // Totals
    var monthlyTotalCost = monthlyFixedCosts + monthlyStaffingCost + monthlyCommissionItems + monthlyBonusItems + monthlyOtherExpenses + monthlyChannelCosts;
    var annualTotalCost = monthlyTotalCost * 12;

    // Profit
    var monthlyNetProfit = monthlyNetRevenue - monthlyTotalCost;
    var annualNetProfit = monthlyNetProfit * 12;
    var profitMargin = monthlyNetRevenue > 0 ? (monthlyNetProfit / monthlyNetRevenue * 100) : 0;

    // Initial investment
    var totalInitialInvestment = 0;
    d.initialInvestment.forEach(function(item) {
      totalInitialInvestment += item.amount || 0;
    });

    // Payback
    var paybackMonths = monthlyNetProfit > 0 ? Math.ceil(totalInitialInvestment / monthlyNetProfit) : -1;
    var cashFlowPositiveMonth = -1;
    if (monthlyNetProfit > 0) {
      var cumulative = -totalInitialInvestment;
      for (var m = 1; m <= 36; m++) {
        cumulative += monthlyNetProfit;
        if (cumulative >= 0) {
          cashFlowPositiveMonth = m;
          break;
        }
      }
    } else if (totalInitialInvestment === 0) {
      cashFlowPositiveMonth = 1;
    }

    // Efficiency
    var areaEfficiency = (p.campusArea || 0) > 0 ? (monthlyNetRevenue / p.campusArea) : 0;
    var staffEfficiency = totalHeadcount > 0 ? (monthlyNetRevenue / totalHeadcount) : 0;

    // Break-even
    var avgMonthlySpend = totalEnrollment > 0 ? (monthlyNetRevenue / totalEnrollment) : 0;
    var breakevenStudents = avgMonthlySpend > 0 ? Math.ceil(monthlyTotalCost / avgMonthlySpend) : 0;

    // Cost breakdown
    var costBreakdown = [
      { name: '固定成本', value: monthlyFixedCosts },
      { name: '人员薪酬', value: monthlyStaffingCost },
      { name: '提成支出', value: monthlyCommissionItems },
      { name: '奖金支出', value: monthlyBonusItems },
      { name: '其他支出', value: monthlyOtherExpenses },
      { name: '获客投入', value: monthlyChannelCosts }
    ];

    return {
      monthlyGrossRevenue: monthlyGrossRevenue,
      renewalRevenue: 0,
      monthlyNetRevenue: monthlyNetRevenue,
      annualRevenue: annualRevenue,
      monthlyFixedCosts: monthlyFixedCosts,
      monthlyStaffingCost: monthlyStaffingCost,
      monthlyCommissionItems: monthlyCommissionItems,
      monthlyBonusItems: monthlyBonusItems,
      monthlyOtherExpenses: monthlyOtherExpenses,
      monthlyChannelCosts: monthlyChannelCosts,
      monthlyTotalCost: monthlyTotalCost,
      annualTotalCost: annualTotalCost,
      monthlyNetProfit: monthlyNetProfit,
      annualNetProfit: annualNetProfit,
      profitMargin: profitMargin,
      totalInitialInvestment: totalInitialInvestment,
      paybackMonths: paybackMonths,
      cashFlowPositiveMonth: cashFlowPositiveMonth,
      areaEfficiency: areaEfficiency,
      staffEfficiency: staffEfficiency,
      totalHeadcount: totalHeadcount,
      totalEnrollment: totalEnrollment,
      monthlyNewStudents: monthlyNewStudents,
      avgMonthlySpend: avgMonthlySpend,
      breakevenStudents: breakevenStudents,
      costBreakdown: costBreakdown
    };
  },

  /* ===== 盈利分析渲染 ===== */
  renderProfitAnalysis: function() {
    var r = this.calculate();

    // Metric cards
    var paybackText = r.paybackMonths > 0 ? r.paybackMonths + '个月' : '无法回本';
    var cashFlowText = r.cashFlowPositiveMonth > 0 ? '第' + r.cashFlowPositiveMonth + '月' : '无法回正';
    var metricsHtml = '' +
      '<div class="metric-card orange"><div class="label">回本周期</div><div class="value">' + paybackText + '</div><div class="desc">初始投资 / 月均净利润</div></div>' +
      '<div class="metric-card green"><div class="label">年度净利润</div><div class="value">' + this.fmt(r.annualNetProfit) + '</div><div class="desc">月度净收入 - 月度总成本</div></div>' +
      '<div class="metric-card red"><div class="label">利润率</div><div class="value">' + this.fmtPct(r.profitMargin) + '</div><div class="desc">净利润 / 净收入</div></div>' +
      '<div class="metric-card blue"><div class="label">年度总收入</div><div class="value">' + this.fmt(r.annualRevenue) + '</div><div class="desc">课程收入，扣除退费</div></div>' +
      '<div class="metric-card purple"><div class="label">年度总成本</div><div class="value">' + this.fmt(r.annualTotalCost) + '</div><div class="desc">全部运营支出</div></div>' +
      '<div class="metric-card teal"><div class="label">现金流回正</div><div class="value">' + cashFlowText + '</div><div class="desc">含初始投资累计现金流转正</div></div>';
    document.getElementById('metrics-grid').innerHTML = metricsHtml;

    // Sub-metrics
    var subHtml = '' +
      '<div class="sub-metric"><div class="label">坪效</div><div class="value">' + this.fmt(r.areaEfficiency) + '</div><div class="label">元/m²/月</div></div>' +
      '<div class="sub-metric"><div class="label">人效</div><div class="value">' + this.fmt(r.staffEfficiency) + '</div><div class="label">元/人/月</div></div>' +
      '<div class="sub-metric"><div class="label">月度新生</div><div class="value">' + this.fmtNum(r.monthlyNewStudents, 1) + '</div><div class="label">人/月（渠道汇总）</div></div>' +
      '<div class="sub-metric"><div class="label">在读学员</div><div class="value">' + r.totalEnrollment + '</div><div class="label">人（课程汇总）</div></div>';
    document.getElementById('sub-metrics').innerHTML = subHtml;

    // Recovery analysis
    var recoveryHtml = '<div class="sub-title">投资回收分析</div>' +
      '<div class="sub-metrics">' +
      '<div class="sub-metric"><div class="label">初始投资总额</div><div class="value">' + this.fmt(r.totalInitialInvestment) + '</div></div>' +
      '<div class="sub-metric"><div class="label">月均净利润</div><div class="value">' + this.fmt(r.monthlyNetProfit) + '</div></div>' +
      '<div class="sub-metric"><div class="label">预计回本周期</div><div class="value">' + paybackText + '</div></div>' +
      '</div>';
    document.getElementById('recovery-analysis').innerHTML = recoveryHtml;

    // Break-even analysis
    var breakevenHtml = '<div class="sub-title">月度盈亏平衡点</div>' +
      '<div class="section-desc">每月至少招收 <strong style="color:var(--accent);font-size:16px;">' + r.breakevenStudents + '</strong> 名学生' +
      '（人均月消费 ' + this.fmt(r.avgMonthlySpend) + '）才能覆盖全部运营成本</div>';
    document.getElementById('breakeven-analysis').innerHTML = breakevenHtml;

    // Charts
    this.renderCostPieChart(r);
    this.renderTrendChart(r);
    this.renderChannelsChart();

    // Cash flow table
    this.renderCashFlowTable(r);

    // Sensitivity analysis
    this.renderSensitivity(r);
  },

  /* ===== 图表：成本占比饼图 ===== */
  renderCostPieChart: function(r) {
    var el = document.getElementById('chart-cost-pie');
    if (!el) return;
    if (this.charts.costPie) this.charts.costPie.dispose();
    this.charts.costPie = echarts.init(el, null, { renderer: 'svg' });

    var pieData = r.costBreakdown.filter(function(c) { return c.value > 0; });
    if (pieData.length === 0) {
      pieData = [{ name: '暂无数据', value: 1 }];
    }

    this.charts.costPie.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)', appendToBody: true },
      legend: { bottom: 0, left: 'center', textStyle: { color: '#6b7280', fontSize: 12 } },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12, color: '#1a1a2e' },
        data: pieData.map(function(c) {
          return { name: c.name, value: Math.round(c.value) };
        })
      }],
      color: ['#4f7cff', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6']
    });
    var self = this;
    window.addEventListener('resize', function() { if (self.charts.costPie) self.charts.costPie.resize(); });
  },

  /* ===== 图表：收支趋势 ===== */
  renderTrendChart: function(r) {
    var el = document.getElementById('chart-trend');
    if (!el) return;
    if (this.charts.trend) this.charts.trend.dispose();
    this.charts.trend = echarts.init(el, null, { renderer: 'svg' });

    var months = [];
    var revenueData = [];
    var costData = [];
    var profitData = [];
    for (var i = 1; i <= 12; i++) {
      months.push('第' + i + '月');
      revenueData.push(Math.round(r.monthlyNetRevenue));
      costData.push(Math.round(r.monthlyTotalCost));
      profitData.push(Math.round(r.monthlyNetProfit));
    }

    this.charts.trend.setOption({
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['月收入', '月成本', '月利润'], bottom: 0, textStyle: { color: '#6b7280', fontSize: 12 } },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: months, axisLabel: { color: '#6b7280', fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { color: '#6b7280', fontSize: 11, formatter: function(v) { return v >= 10000 ? (v/10000).toFixed(1) + '万' : v; } } },
      series: [
        { name: '月收入', type: 'bar', data: revenueData, itemStyle: { color: '#4f7cff', borderRadius: [4,4,0,0] } },
        { name: '月成本', type: 'bar', data: costData, itemStyle: { color: '#8b5cf6', borderRadius: [4,4,0,0] } },
        { name: '月利润', type: 'line', data: profitData, smooth: true, lineStyle: { width: 3, color: '#10b981' }, itemStyle: { color: '#10b981' }, symbolSize: 6 }
      ]
    });
    var self = this;
    window.addEventListener('resize', function() { if (self.charts.trend) self.charts.trend.resize(); });
  },

  /* ===== 图表：获客渠道对比 ===== */
  renderChannelsChart: function() {
    var el = document.getElementById('chart-channels');
    if (!el) return;
    if (this.charts.channels) this.charts.channels.dispose();
    this.charts.channels = echarts.init(el, null, { renderer: 'svg' });

    var names = [];
    var investments = [];
    var outputs = [];
    this.data.channels.forEach(function(c) {
      var conversions = (c.expectedLeads || 0) * (c.conversionRate || 0) / 100;
      var output = conversions * (c.avgCustomerValue || 0);
      if ((c.monthlyInvestment || 0) > 0 || output > 0) {
        names.push(c.name || '未命名');
        investments.push(Math.round((c.monthlyInvestment || 0) * 12));
        outputs.push(Math.round(output * 12));
      }
    });

    if (names.length === 0) {
      names = ['暂无数据'];
      investments = [0];
      outputs = [0];
    }

    this.charts.channels.setOption({
      tooltip: { trigger: 'axis', appendToBody: true, formatter: function(params) {
        var s = params[0].name + '<br/>';
        params.forEach(function(p) { s += p.marker + p.seriesName + ': ¥' + p.value.toLocaleString() + '<br/>'; });
        return s;
      }},
      legend: { data: ['年度投入', '年度产出'], bottom: 0, textStyle: { color: '#6b7280', fontSize: 12 } },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: names, axisLabel: { color: '#6b7280', fontSize: 11, rotate: names.length > 4 ? 15 : 0 } },
      yAxis: { type: 'value', axisLabel: { color: '#6b7280', fontSize: 11, formatter: function(v) { return v >= 10000 ? (v/10000).toFixed(1) + '万' : v; } } },
      series: [
        { name: '年度投入', type: 'bar', data: investments, itemStyle: { color: '#ef4444', borderRadius: [4,4,0,0] } },
        { name: '年度产出', type: 'bar', data: outputs, itemStyle: { color: '#10b981', borderRadius: [4,4,0,0] } }
      ]
    });
    var self = this;
    window.addEventListener('resize', function() { if (self.charts.channels) self.charts.channels.resize(); });
  },

  /* ===== 现金流表 ===== */
  renderCashFlowTable: function(r) {
    var html = '<div class="chart-container"><h3>18个月现金流预测（含初始投资）</h3>';
    html += '<div class="table-wrap"><table class="data-table cashflow-table"><thead><tr>' +
      '<th>月份</th><th>月收入</th><th>月成本</th><th>月利润</th><th>累计利润</th><th>含初始投资</th>' +
      '</tr></thead><tbody>';
    var cumulative = 0;
    var cumulativeWithInvest = -r.totalInitialInvestment;
    for (var m = 1; m <= 18; m++) {
      cumulative += r.monthlyNetProfit;
      cumulativeWithInvest += r.monthlyNetProfit;
      html += '<tr>' +
        '<td>第' + m + '月</td>' +
        '<td>' + this.fmt(r.monthlyNetRevenue) + '</td>' +
        '<td>' + this.fmt(r.monthlyTotalCost) + '</td>' +
        '<td class="' + (r.monthlyNetProfit >= 0 ? 'positive' : 'negative') + '">' + this.fmt(r.monthlyNetProfit) + '</td>' +
        '<td class="' + (cumulative >= 0 ? 'positive' : 'negative') + '">' + this.fmt(cumulative) + '</td>' +
        '<td class="' + (cumulativeWithInvest >= 0 ? 'positive' : 'negative') + '">' + this.fmt(cumulativeWithInvest) + '</td>' +
        '</tr>';
    }
    html += '</tbody></table></div></div>';
    document.getElementById('cashflow-section').innerHTML = html;
  },

  /* ===== 敏感性分析 ===== */
  renderSensitivity: function(r) {
    var d = this.data;
    var p = d.operatingParams;
    var self = this;

    var html = '<div class="chart-container"><h3>敏感性分析</h3>';
    html += '<p style="font-size:12px;color:var(--muted);margin-bottom:16px;">查看各关键因素变化对月利润的影响，蓝色高亮行为当前设定值</p>';
    html += '<div class="sensitivity-grid">';

    // 1. 招生人数变化
    var enrollmentChanges = [-30, -20, -10, 0, 10, 20, 30];
    html += '<div class="sensitivity-card"><h4>招生人数变化</h4><div class="desc">调整所有课程预计招生人数</div>';
    html += '<table><thead><tr><th>变动</th><th>月收入</th><th>月利润</th><th>利润率</th></tr></thead><tbody>';
    enrollmentChanges.forEach(function(chg) {
      var factor = 1 + chg / 100;
      var gross = 0;
      d.courses.forEach(function(c) {
        var rev = (c.pricePerHour||0) * (c.hours||0) * (c.enrollment||0) * factor;
        if (c.name && c.name.indexOf('季卡') >= 0) { rev = rev / 3; }
        gross += rev;
      });
      var netRev = gross * (1 - (p.refundRate||0) / 100);
      var profit = netRev - r.monthlyTotalCost;
      var margin = netRev > 0 ? (profit / netRev * 100) : 0;
      var label = (chg >= 0 ? '+' : '') + chg + '%' + (chg === 0 ? ' (当前)' : '');
      html += '<tr' + (chg === 0 ? ' class="highlight"' : '') + '><td>' + label + '</td><td>' + self.fmt(netRev) + '</td><td>' + self.fmt(profit) + '</td><td>' + self.fmtPct(margin) + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // 2. 月度成本变化
    var costChanges = [-20, -10, 0, 10, 20, 30];
    html += '<div class="sensitivity-card"><h4>月度成本变化</h4><div class="desc">调整全部运营支出</div>';
    html += '<table><thead><tr><th>变动</th><th>月收入</th><th>月利润</th><th>利润率</th></tr></thead><tbody>';
    costChanges.forEach(function(chg) {
      var costFactor = 1 + chg / 100;
      var adjCost = r.monthlyTotalCost * costFactor;
      var profit = r.monthlyNetRevenue - adjCost;
      var margin = r.monthlyNetRevenue > 0 ? (profit / r.monthlyNetRevenue * 100) : 0;
      var label = (chg >= 0 ? '+' : '') + chg + '%' + (chg === 0 ? ' (当前)' : '');
      html += '<tr' + (chg === 0 ? ' class="highlight"' : '') + '><td>' + label + '</td><td>' + self.fmt(r.monthlyNetRevenue) + '</td><td>' + self.fmt(profit) + '</td><td>' + self.fmtPct(margin) + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // 3. 客单价变化
    var priceChanges = [-20, -10, 0, 10, 20, 30];
    html += '<div class="sensitivity-card"><h4>客单价变化</h4><div class="desc">调整所有课程单课时价格</div>';
    html += '<table><thead><tr><th>变动</th><th>月收入</th><th>月利润</th><th>利润率</th></tr></thead><tbody>';
    priceChanges.forEach(function(chg) {
      var factor = 1 + chg / 100;
      var gross = 0;
      d.courses.forEach(function(c) {
        var rev = (c.pricePerHour||0) * factor * (c.hours||0) * (c.enrollment||0);
        if (c.name && c.name.indexOf('季卡') >= 0) { rev = rev / 3; }
        gross += rev;
      });
      var netRev = gross * (1 - (p.refundRate||0) / 100);
      var profit = netRev - r.monthlyTotalCost;
      var margin = netRev > 0 ? (profit / netRev * 100) : 0;
      var label = (chg >= 0 ? '+' : '') + chg + '%' + (chg === 0 ? ' (当前)' : '');
      html += '<tr' + (chg === 0 ? ' class="highlight"' : '') + '><td>' + label + '</td><td>' + self.fmt(netRev) + '</td><td>' + self.fmt(profit) + '</td><td>' + self.fmtPct(margin) + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // 4. 退费率变化
    var refundRates = [5, 10, 15, 20, 25, 30];
    html += '<div class="sensitivity-card"><h4>退费率变化</h4><div class="desc">调整学员退费比例</div>';
    html += '<table><thead><tr><th>变动</th><th>月收入</th><th>月利润</th><th>利润率</th></tr></thead><tbody>';
    refundRates.forEach(function(rate) {
      var netRev = r.monthlyGrossRevenue * (1 - rate / 100);
      var profit = netRev - r.monthlyTotalCost;
      var margin = netRev > 0 ? (profit / netRev * 100) : 0;
      var label = rate + '%' + (rate === (p.refundRate||0) ? ' (当前)' : '');
      html += '<tr' + (rate === (p.refundRate||0) ? ' class="highlight"' : '') + '><td>' + label + '</td><td>' + self.fmt(netRev) + '</td><td>' + self.fmt(profit) + '</td><td>' + self.fmtPct(margin) + '</td></tr>';
    });
    html += '</tbody></table></div>';

    html += '</div></div>';
    document.getElementById('sensitivity-section').innerHTML = html;
  },

  /* ===== 数据持久化 ===== */
  saveToLocalStorage: function() {
    try {
      var d = JSON.parse(JSON.stringify(this.data));
      d._version = this.DATA_VERSION;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(d));
    } catch(e) {}
  },

  loadFromLocalStorage: function() {
    try {
      var s = localStorage.getItem(this.STORAGE_KEY);
      if (s) {
        var d = JSON.parse(s);
        // Version check: discard old data if version mismatches
        if (d._version !== this.DATA_VERSION) return null;
        // Merge with defaults to ensure all fields exist
        var defaults = this.getDefaultData();
        return Object.assign(defaults, d);
      }
    } catch(e) {}
    return null;
  },

  /* ===== JSON 导入导出 ===== */
  exportJSON: function() {
    var exportData = JSON.parse(JSON.stringify(this.data));
    delete exportData._version;
    var json = JSON.stringify(exportData, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '三陶自习室盈利测算_' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('JSON 已导出');
  },

  showImportDialog: function() {
    document.getElementById('importTextarea').value = '';
    this.showModal('importModal');
  },

  importJSON: function() {
    var text = document.getElementById('importTextarea').value.trim();
    if (!text) { this.showToast('请粘贴JSON内容'); return; }
    try {
      var parsed = JSON.parse(text);
      var defaults = this.getDefaultData();
      this.data = Object.assign(defaults, parsed);
      this.saveToLocalStorage();
      this.renderAll();
      this.closeModal('importModal');
      this.showToast('数据导入成功');
    } catch(e) {
      this.showToast('JSON 格式错误，请检查');
    }
  },

  /* ===== 记录管理 ===== */
  saveRecord: function() {
    document.getElementById('recordName').value = '';
    this.showModal('saveModal');
  },

  confirmSaveRecord: function() {
    var name = document.getElementById('recordName').value.trim();
    if (!name) { this.showToast('请输入记录名称'); return; }
    var records = this.getRecords();
    records.push({
      id: Date.now(),
      name: name,
      date: new Date().toLocaleString('zh-CN'),
      data: JSON.parse(JSON.stringify(this.data))
    });
    try {
      localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    } catch(e) {
      this.showToast('保存失败，存储空间不足');
      return;
    }
    this.closeModal('saveModal');
    this.showToast('记录已保存');
  },

  getRecords: function() {
    try {
      var s = localStorage.getItem(this.RECORDS_KEY);
      if (s) return JSON.parse(s);
    } catch(e) {}
    return [];
  },

  showRecords: function() {
    var records = this.getRecords();
    var html = '';
    if (records.length === 0) {
      html = '<li style="text-align:center;color:var(--muted);padding:20px;">暂无保存记录</li>';
    } else {
      var self = this;
      records.forEach(function(r) {
        html += '<li>' +
          '<div class="record-info">' +
            '<div class="record-name">' + self.esc(r.name) + '</div>' +
            '<div class="record-date">' + r.date + '</div>' +
          '</div>' +
          '<div class="record-actions">' +
            '<button class="btn btn-import" onclick="App.loadRecord(' + r.id + ')">加载</button>' +
            '<button class="btn-del" onclick="App.deleteRecord(' + r.id + ')">删除</button>' +
          '</div>' +
        '</li>';
      });
    }
    document.getElementById('records-list').innerHTML = html;
    this.showModal('recordsModal');
  },

  loadRecord: function(id) {
    var records = this.getRecords();
    var record = records.find(function(r) { return r.id === id; });
    if (record) {
      var defaults = this.getDefaultData();
      this.data = Object.assign(defaults, record.data);
      this.saveToLocalStorage();
      this.renderAll();
      this.closeModal('recordsModal');
      this.showToast('已加载记录：' + record.name);
    }
  },

  deleteRecord: function(id) {
    var records = this.getRecords().filter(function(r) { return r.id !== id; });
    try {
      localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    } catch(e) {}
    this.showRecords();
    this.showToast('记录已删除');
  },

  /* ===== 重置数据 ===== */
  resetData: function() {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      this.data = this.getDefaultData();
      this.saveToLocalStorage();
      this.renderAll();
      this.showToast('数据已重置');
    }
  },

  /* ===== UI 辅助 ===== */
  showToast: function(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
  },

  showModal: function(id) {
    document.getElementById(id).classList.add('show');
  },

  closeModal: function(id) {
    document.getElementById(id).classList.remove('show');
  }
};

/* ===== 启动 ===== */
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});
