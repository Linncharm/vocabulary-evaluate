Page({
  data: {
    wg2:0,
    wg3:0,
    sum:0,
    totalWeight:0,
    rate2:0,
    total1:0,
    total2:0,
    gradientRange: [],
    checkboxes: [
      //由于范围更加精确，因此无需消除大权重的影响，直接计算平均权重即可
      //total=120
      [{ label: 'Option 1', checked: false ,weight:2 }, { label: 'Option 2', checked: false ,weight:2 }],
      [{ label: 'Option 3', checked: false ,weight:2 }, { label: 'Option 4', checked: false ,weight:2 }],
      [{ label: 'Option 5', checked: false ,weight:2 }, { label: 'Option 6', checked: false ,weight:2 }],
      [{ label: 'Option 7', checked: false ,weight:3 }, { label: 'Option 8', checked: false ,weight:3}],
      [{ label: 'Option 9', checked: false ,weight:3 }, { label: 'Option 10', checked: false ,weight:3}],
      [{ label: 'Option 11', checked: false ,weight:3}, { label: 'Option 12', checked: false ,weight:3}],
      [{ label: 'Option 13', checked: false ,weight:4}, { label: 'Option 14', checked: false ,weight:4}],
      [{ label: 'Option 15', checked: false ,weight:4}, { label: 'Option 16', checked: false ,weight:4}],
      [{ label: 'Option 17', checked: false ,weight:4}, { label: 'Option 18', checked: false ,weight:4}],
      [{ label: 'Option 19', checked: false ,weight:5}, { label: 'Option 20', checked: false ,weight:5}],
      [{ label: 'Option 21', checked: false ,weight:5}, { label: 'Option 22', checked: false ,weight:5}],
      [{ label: 'Option 23', checked: false ,weight:5}, { label: 'Option 24', checked: false ,weight:5}],
      [{ label: 'Option 25', checked: false ,weight:6}, { label: 'Option 26', checked: false ,weight:6}],
      [{ label: 'Option 27', checked: false ,weight:6}, { label: 'Option 28', checked: false ,weight:6}],
      [{ label: 'Option 29', checked: false ,weight:6}, { label: 'Option 30', checked: false ,weight:6}],
      //[{ label: 'Option 31', checked: false ,weight:3}, { label: 'Option 32', checked: false ,weight:3}],
    ],

  },  

  navigateToNextPage() {
    this.calculateTotalWeight();
    const totalWeight = this.data.totalWeight;
    const rate2=this.data.rate2;
    console.log('rate2',rate2)
    console.log('Total Weight:', totalWeight);

    // 设置梯度范围和随机选择词语的数量
    const gradientRange = this.data.gradientRange;
    let final ='';
    const total=120; //经过平滑处理后的总权值
    if (totalWeight < total*(1/5)) {
      final = gradientRange[0];
    } else if (totalWeight < total*(2/5)) {
      final = gradientRange[1];
    } else if (totalWeight < total*(3/5)) {
      final = gradientRange[2];
    } else if (totalWeight < total*(4/5)) {
      final = gradientRange[3];
    } else {
      final = gradientRange[4];
    } 

    function f(x) {
      return Math.pow(x + 2.17, 3.13) + 1000;
    }

    function calculateWg3(finalValue) {
      return f(finalValue);
    }
    const wg3 = calculateWg3(final);
    
    console.log('wg3',wg3)
    //const total1=this.data.total1
    const total2= this.data.wg2*0.5*rate2
    let total1=this.data.total1
    console.log('total2',total2)
    wx.navigateTo({
        url: `/pages/test4/test4?final=${final}&total1=${total1}&total2=${total2}&wg3=${wg3}`,
    });
},


calculateTotalWeight() {
  let rate2=0;
  let totalWeight = 0;
  let sum=0;
  //const weightDecayFunction = w => Math.log1p(w); //使用对数函数减少大权重的影响

  this.data.checkboxes.flat().forEach(checkbox => {
    if (checkbox.checked) {
      totalWeight += (checkbox.weight);
      sum=sum+1;
    }
  });
  rate2=sum/30
  this.setData({
    totalWeight:totalWeight,
    rate2:rate2
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
    const gradientRange = this.data.gradientRange;

    const fetchWordData = (collection, size) => {
        return db.collection(collection)
            .aggregate()
            .sample({ size: size })
            .end()
            .then(res => res.list.map(item => item.headword.trim()));
    };

    const wordPromises = gradientRange.map(gradient => fetchWordData(`word${gradient-1}`, 6)); //gradient-1

    Promise.all(wordPromises).then(results => {
        const options = results.flat().map((word, index) => ({
            label: word,
            checked: false
        }));

        if (options.length < 30) {
            console.error('数据库返回的结果不足以填充所有的复选框');
            return;
        }

        console.log('获取的选项数据:', options); // 添加调试信息

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
                        return col;
                    }
                })
            )
        });

        console.log('复选框数据更新成功:', this.data.checkboxes); // 添加调试信息
    }).catch(err => {
        console.error('数据库查询失败', err);
    });
},





onLoad(options) {
  if (options.gradientRange) {
      try {
          const gradientRange = JSON.parse(decodeURIComponent(options.gradientRange));
          console.log('接收到的 gradientRange:', gradientRange);
          this.setData({
              gradientRange: gradientRange
          });
      } catch (e) {
          console.error('解析 gradientRange 失败:', e);
      }
  }

  if(options.total1){
    this.setData({
      total1:options.total1
    })
  }
  if(options.wg2){
    this.setData({
      wg2:options.wg2
    })
  }
  this.getData()
  //问题出现原因，有两个onload function并列
},



  onShow() {
    console.log('Received Total Weight:', this.data.gradientRange); //调试
  }

});
