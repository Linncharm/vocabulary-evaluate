Page({
  data: {
    total:0,
    totalWeight:0,
    rate1:0,
    checkboxes: [
      [{ label: 'Option 1', checked: false ,weight:1 }, { label: 'Option 2', checked: false ,weight:1 }],
      [{ label: 'Option 3', checked: false ,weight:2 }, { label: 'Option 4', checked: false ,weight:2 }],
      [{ label: 'Option 5', checked: false ,weight:3 }, { label: 'Option 6', checked: false ,weight:3 }],
      [{ label: 'Option 7', checked: false ,weight:4 }, { label: 'Option 8', checked: false ,weight:4}],
      [{ label: 'Option 9', checked: false ,weight:5 }, { label: 'Option 10', checked: false ,weight:5}],
      [{ label: 'Option 11', checked: false ,weight:6}, { label: 'Option 12', checked: false ,weight:6}],
      [{ label: 'Option 13', checked: false ,weight:7}, { label: 'Option 14', checked: false ,weight:7}],
      [{ label: 'Option 15', checked: false ,weight:8}, { label: 'Option 16', checked: false ,weight:8}],
      [{ label: 'Option 17', checked: false ,weight:9}, { label: 'Option 18', checked: false ,weight:9}],
      [{ label: 'Option 19', checked: false ,weight:10}, { label: 'Option 20', checked: false ,weight:10}],
      [{ label: 'Option 21', checked: false ,weight:11}, { label: 'Option 22', checked: false ,weight:11}],
      [{ label: 'Option 23', checked: false ,weight:12}, { label: 'Option 24', checked: false ,weight:12}],
      [{ label: 'Option 25', checked: false ,weight:13}, { label: 'Option 26', checked: false ,weight:13}],
      [{ label: 'Option 27', checked: false ,weight:14}, { label: 'Option 28', checked: false ,weight:14}],
      [{ label: 'Option 29', checked: false ,weight:15}, { label: 'Option 30', checked: false ,weight:15}],
      [{ label: 'Option 31', checked: false ,weight:16}, { label: 'Option 32', checked: false ,weight:16}],
      [{ label: 'Option 33', checked: false ,weight:17}, { label: 'Option 34', checked: false ,weight:17}],
      [{ label: 'Option 35', checked: false ,weight:18}, { label: 'Option 36', checked: false ,weight:18}],
      [{ label: 'Option 37', checked: false ,weight:19}, { label: 'Option 38', checked: false ,weight:19}],
      [{ label: 'Option 39', checked: false ,weight:20}, { label: 'Option 40', checked: false ,weight:20}],
    ],

  },  

  onLoad() {
    this.getData();
  },

  navigateToNextPage() {
    this.calculateTotalWeight();
    const totalWeight =this.data.totalWeight;
    const rate1 = this.data.rate1;
    console.log('Total Weight:', totalWeight);
    console.log('rate1',rate1)
  
    const total = 90.77027779695383;
    // 总权重值
    // 设置梯度范围
    let gradientRange = [];
    const gradientSteps = 16;
    for (let i = 1; i <= gradientSteps; i++) {
      if (totalWeight <= total * (i / gradientSteps)) {
        gradientRange = [i, i + 1, i + 2, i + 3, i + 4];
        break;
      }
    }
  
    // 定义 f(x) 函数
    function f(x) {
      return Math.pow(x + 2.17, 3.13) + 1000;
    }

    // 计算 wg2
    function calculateWg2(gradientValues) {
      const results = gradientValues.map(g => f(g));
      const wg2 = results.reduce((acc, val) => acc + val, 0) / results.length;
      return wg2;
    }

    // 计算并输出 wg2
    const wg2 = calculateWg2(gradientRange);
    const total1=5755*0.2*rate1;
    console.log('total1',total1);
    console.log(`wg2: ${wg2}`);

    wx.navigateTo({
      url: `/pages/test3/test3?gradientRange=${JSON.stringify(gradientRange)}&total1=${JSON.stringify(total1)}&wg2=${JSON.stringify(wg2)}`,
    });
  },  


calculateTotalWeight() {
  let rate1=0;
  let sum=0;
  let totalWeight = 0;
  const weightDecayFunction = w => Math.log1p(w); //使用对数函数减少大权重的影响

  this.data.checkboxes.flat().forEach(checkbox => {
    if (checkbox.checked) {
      totalWeight += weightDecayFunction(checkbox.weight);
      sum=sum+1;
    }
  });
  rate1=sum/40
  this.setData({
    totalWeight:totalWeight,
    rate1:rate1
  })
},
  

  onChange(event) {
    const row = event.currentTarget.dataset.row;  // 获取变化的复选框所在的行索引
    const col = event.currentTarget.dataset.col;  // 获取变化的复选框所在的列索引
    const newChecked = event.detail;  // 获取变化后的状态

    this.setData({
      [`checkboxes[${row}][${col}].checked`]: newChecked  // 更新对应复选框的状态
    });
  },

  getData() {
    const db = wx.cloud.database();

    const fetchWordData = (collection, size) => {
      return db.collection(collection)
               .aggregate()
               .sample({ size: size })
               .end()
               .then(res => {
                 console.log('数据库查询结果:', res);
                 return res.list.map(item => item.headword.trim());
               });
    };

    Promise.all([
      fetchWordData('word0', 2),
      fetchWordData('word1', 2),
      fetchWordData('word2', 2),
      fetchWordData('word3', 2),
      fetchWordData('word4', 2),
      fetchWordData('word5', 2),
      fetchWordData('word6', 2),
      fetchWordData('word7', 2),
      fetchWordData('word8', 2),
      fetchWordData('word9', 2),
      fetchWordData('word10', 2),
      fetchWordData('word11', 2),
      fetchWordData('word12', 2),
      fetchWordData('word13', 2),
      fetchWordData('word14', 2),
      fetchWordData('word15', 2),
      fetchWordData('word16', 2),
      fetchWordData('word17', 2),
      fetchWordData('word18', 2),
      fetchWordData('word19', 2)
    ]).then(results => {
      const options = results.flat().map((word, index) => ({
        label: word,
        checked: false
      }));

      if (options.length < this.data.checkboxes.flat().length) {
        console.error('数据库返回的结果不足以填充所有的复选框');
        return;
      }

      this.setData({
        checkboxes: this.data.checkboxes.map((row, rowIndex) => 
          row.map((col, colIndex) => {
            const optionIndex = rowIndex * 2 + colIndex;
            if (options[optionIndex]) {
              return {
                ...col,
                label: options[optionIndex].label
              };
            } else {
              return col;  // 保持原有值，避免未定义错误
            }
          })
        )
      });
    }).catch(err => {
      console.error('数据库查询失败', err);
    });
  }
});
