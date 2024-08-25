//const { count } = require('console');

Page({
  data: {
    final:0,
    weightSum: 0 ,
    final2: 0 ,
    sum:0,
    wg1:5755,
    wg2:0,
    wg3:0,
    wr1:0.2,
    wr2:0.5,
    wr3:0.9,
    rate1:0,
    rate2:0,
    rate3:0,
    total1:0,
    total2:0,
    score:0,
    cloudpath:'cloud://cloud1-5gmwyfvq214ca144.636c-cloud1-5gmwyfvq214ca144-1327334961/wordlist2.txt',
  
    checkboxes: [
      [{ label: 'Option 1', checked: false, weight: 1 }, { label: 'Option 2', checked: false, weight: 1 }],
      [{ label: 'Option 3', checked: false, weight: 1 }, { label: 'Option 4', checked: false, weight: 1 }],
      [{ label: 'Option 5', checked: false, weight: 1 }, { label: 'Option 6', checked: false, weight: 2 }],
      [{ label: 'Option 7', checked: false, weight: 2 }, { label: 'Option 8', checked: false, weight: 2 }],
      [{ label: 'Option 9', checked: false, weight: 2 }, { label: 'Option 10', checked: false, weight: 2 }],
      [{ label: 'Option 11', checked: false, weight: 3 }, { label: 'Option 12', checked: false, weight: 3 }],
      [{ label: 'Option 13', checked: false, weight: 3 }, { label: 'Option 14', checked: false, weight: 3 }],
      [{ label: 'Option 15', checked: false, weight: 3 }, { label: 'Option 16', checked: false, weight: 4 }],
      [{ label: 'Option 17', checked: false, weight: 4 }, { label: 'Option 18', checked: false, weight: 4 }],
      [{ label: 'Option 19', checked: false, weight: 4 }, { label: 'Option 20', checked: false, weight: 4 }],
      [{ label: 'Option 21', checked: false, weight: 5 }, { label: 'Option 22', checked: false, weight: 5 }],
      [{ label: 'Option 23', checked: false, weight: 5 }, { label: 'Option 24', checked: false, weight: 5 }],
      [{ label: 'Option 25', checked: false, weight: 5 }, { label: 'Option 26', checked: false, weight: 6 }],
      [{ label: 'Option 27', checked: false, weight: 6 }, { label: 'Option 28', checked: false, weight: 6 }],
      [{ label: 'Option 29', checked: false, weight: 6 }, { label: 'Option 30', checked: false, weight: 6 }],
      [{ label: 'Option 31', checked: false, weight: 5 }, { label: 'Option 32', checked: false, weight: 5 }],
      [{ label: 'Option 33', checked: false, weight: 5 }, { label: 'Option 34', checked: false, weight: 5 }],
      [{ label: 'Option 35', checked: false, weight: 5 }, { label: 'Option 36', checked: false, weight: 6 }],
      [{ label: 'Option 37', checked: false, weight: 6 }, { label: 'Option 38', checked: false, weight: 6 }],
      [{ label: 'Option 39', checked: false, weight: 6 }, { label: 'Option 40', checked: false, weight: 6 }],
    ],
  },

  navigateToNextPage() {
    this.calculateTotalWeight();
    const score_original = (this.data.total1)+(this.data.total2)+(this.data.wg3*this.data.wr3*this.data.rate3);
    const score = Math.round(score_original); //四舍五入取整

    console.log('Score:', score);
    this.setData({
      score:score
    })
    //console.log('Rate:', rate);
    this.saveUserResult();
    wx.navigateTo({
        url: `/pages/finish/finish?score=${score}`,
    });
    
},

  calculateTotalWeight() {
    const checkboxes = this.data.checkboxes;
    let totalSelectedWeight = 0;
    let rate3=0;
    let totalCheckboxes = 0;
    let sum=0;
    // Traverse through all checkboxes and sum up the weights of checked ones
    for (let row of checkboxes) {
        for (let checkbox of row) {
            totalCheckboxes += 1;
            if (checkbox.checked) {
                totalSelectedWeight += 1;
                sum=sum+1;
            }
        }
    }
    rate3=sum/40
    this.setData({
      rate3:rate3
    })
    console.log('rate3',rate3);
    /* 
    
    return {
        totalSelectedWeight,
        totalCheckboxes
    };
    */
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
    const final = this.data.final;
    const fetchWordData0 = (collection, size) => {
        return db.collection(collection)
                 .aggregate()
                 .sample({ size: size*2 }) // 获取更多数据 ,默认为20 
                 .limit(40)
                 .end()
                 .then(res => {
                     //console.log('数据库查询结果:', res);
                     return res.list.map(item => item.headword.trim());
                 });
    };

    Promise.all([
        fetchWordData0(`word${final-1}`, 30),
        //fetchWordData(`word${final-1}`, 15),
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
},

isSubsequenceMatch(str1, str2, length) {
  // 检查str1中是否存在长度为length的子串在str2中
  for (let i = 0; i <= str1.length - length; i++) {
    const subStr1 = str1.substring(i, i + length);
    let found = false;
    for (let j = 0; j <= str2.length - length; j++) {
      if (subStr1 === str2.substring(j, j + length)) {
        found = true;
        break;
      }
    }
    if (found) {
      return true;
    }
  }
  return false;
},

   //批处理调试函数
   //要确保在调用 testAlgorithm2() 时，testAlgorithm() 中的 weightSum 已经计算完成并正确地设置到 weightSum2 中
   //使用JavaScript中的Promise机制来管理这些异步操作的顺序和依赖关系。
   //将 testAlgorithm() 修改为返回一个Promise对象，以便在数据处理完毕后进行正确的处理和操作：
   testAlgorithm() {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database();
      const databaseArray = [];
  
      const fetchWordData1 = (collection, size) => {
        return db.collection(collection)
          .aggregate()
          .sample({ size: size })
          .end()
          .then(res => res.list.map(item => item.headword.trim()));
      };
  
      const fetchPromises = Array.from({ length: 20 }, (_, index) => {
        const collectionName = `word${index}`;
        return fetchWordData1(collectionName, 2).then(words => {
          const database = {
            collection: collectionName,
            words: words.map(word => ({ word })),
            count: '0',
          };
          databaseArray[index] = database; // Ensure correct order
        });
      });
  
      Promise.all(fetchPromises).then(() => {
        //console.log('获取的选项数据:', databaseArray);
  
        for (let i = 0; i < 20; i++) {
          databaseArray[i].count = i + 2; // 依次赋值为2到21
        }
  
        // Download and read file from cloud storage
        wx.cloud.downloadFile({
          fileID: this.data.cloudpath,
          timeout: '10000000',
          success: res => {
            if (res.statusCode === 200) {
              const wordListContent = res.tempFilePath;
              wx.getFileSystemManager().readFile({
                filePath: wordListContent,
                encoding: 'utf8',
                success: res => {
                  const wordListContent = res.data;
                  const wordListArray = wordListContent.split('\n').map(word => word.trim());
                  //console.log('wordListArray',wordListArray);
                  let rate1=0;
                  let weightSum = 0;
                  let sum = 0;
                  wordListArray.forEach(word => {
                    databaseArray.forEach(database => {
                      database.words.forEach(dbWord => {
                        //if (this.isSubsequenceMatch(dbWord.word, word, 3)) {  //若有匹配单词则权重累计增加
                        if(dbWord.word === word) {
                          //console.log(`Match found between ${dbWord.word} and ${word}`);
                          sum = sum+1;
                          weightSum += Math.log1p(database.count - 1);
                        }
                      });
                    });
                  });
                  rate1=sum/40;
                  this.setData({
                    weightSum: weightSum,
                    rate1:rate1
                  });
                  console.log('rate1=',rate1)
                  console.log('weightsum1', weightSum);
                  //console.log('dataweightSum', this.data.weightSum);
  
                  resolve();
                },
                fail: err => {
                  console.error('读取文件失败:', err);
                  reject(err); // Reject if readFile fails
                }
              });
            } else {
              console.error('下载文件失败');
              reject('下载文件失败'); // Reject if downloadFile fails
            }
          },
          fail: err => {
            console.error('下载文件失败:', err);
            reject(err); // Reject if cloud download fails
          }
        });
  
      }).catch(err => {
        console.error('数据库查询出错:', err);
        reject(err); // Reject if fetchPromises fail
      });
    });
    },  


  testAlgorithm2(){
    return new Promise((resolve, reject) => {
        //进入第二梯度
        let gradientRange = [];
        const gradientSteps = 16;
        //const weightSum = this.data.weightSum;  测试发现此代码有误
        const weightSum2 = this.data.weightSum;
        console.log('测试sum',weightSum2)
        const total = 90.760277796953816052320947902151;
        for (let i = 1; i <= gradientSteps; i++) {
          if (weightSum2 <= total * (i / gradientSteps)) {
            gradientRange = [i, i + 1, i + 2, i + 3, i + 4];
            break;
          }
        }

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
        console.log('测试用gradientRange=',gradientRange);
        console.log('wg2',wg2);
        this.setData({
          wg2: wg2
        });
        const db = wx.cloud.database();
        //const gradientRange = this.data.gradientRange;

    const fetchWordData2 = (collection, size) => {
        return db.collection(collection)
            .aggregate()
            .sample({ size: size })
            .end()
            .then(res => res.list.map(item => item.headword.trim()));
    };

    const databaseArray = []; // 初始化数组

    const fetchPromises = gradientRange.map(gradient => {
      const promises = Array.from({ length: 6 }, (_, index) => {
          const collectionName = `word${gradient - 1}`;
          return fetchWordData2(collectionName, 1).then(words => ({
              collection: collectionName,
              words: [{ word: words[0] }],
              count: '0',
          }));
      });
      return Promise.all(promises);
  });
  

  Promise.all(fetchPromises).then(results => {
    results.forEach(result => {
        databaseArray.push(...result);
    });

    // 给每个项赋值 count，范围为2到21
    
    databaseArray.forEach((item, index) => {
      if (index < 6) {
        item.count = 2;
      } else if (index < 12) {
        item.count = 3;
      } else if (index < 18) {
        item.count = 4;
      } else if (index < 24) {
        item.count = 5;
      } else {
        item.count = 6;
      }
    });

    wx.cloud.downloadFile({
      fileID: this.data.cloudpath,
      timeout: '10000000',
      success: res => {
        if (res.statusCode === 200) {
          const wordListContent = res.tempFilePath;
          wx.getFileSystemManager().readFile({
            filePath: wordListContent,
            encoding: 'utf8',
            success: res => {
              const wordListContent = res.data;
              const wordListArray = wordListContent.split('\n').map(word => word.trim());
    
              let weightSum = 0;
              let sum=0;
              let rate2=0;
              wordListArray.forEach(word => {
                databaseArray.forEach(database => {
                  database.words.forEach(dbWord => {
                    //if (this.isSubsequenceMatch(dbWord.word, word, 3)) { 
                      if(dbWord.word === word) { //若有匹配单词则权重累计增加
                      weightSum += database.count; //单纯累加count值，与前面算法逻辑一样
                      sum=sum+1;
                    }
                  });
                });
              });
              rate2=sum/30
              this.setData({
                rate2:rate2
              })
              console.log('rate2=',rate2);
              console.log('weightsum2=',weightSum);
              let final2 ='';
              const total=120; //经过平滑处理后的总权值
    
              if (weightSum < total*(1/5)) {
                final2 = gradientRange[0];
              } else if (weightSum < total*(2/5)) {
                final2 = gradientRange[1];
              } else if (weightSum < total*(3/5)) {
                final2 = gradientRange[2];
              } else if (weightSum < total*(4/5)) {
                final2 = gradientRange[3];
              } else {
                final2 = gradientRange[4];
              } 
    
              console.log('测试得出的final2值为',final2);
              this.setData({
                final2: final2
              });
    
              resolve(); //实现同步
    
              //console.log('weightsum', weightSum);
              //console.log('dataweightSum', this.data.weightSum);
            },
            fail: err => {
              console.error('读取文件失败:', err);
              reject(err); // Reject if readFile fails
            }
          });
        } else {
          console.error('下载文件失败');
          reject('下载文件失败'); // Reject if downloadFile fails
        }
      },
      fail: err => {
        console.error('下载文件失败:', err);
        reject(err); // Reject if cloud download fails
      }
    });

    //console.log('获取的选项数据2:', databaseArray);
});

  });
    },

  testAlgorithm3(finalValue) {

    function f(x) {
      return Math.pow(x + 2.17, 3.13) + 1000;
    }

    function calculateWg3(finalValue) {
      return f(finalValue);
    }
    const wg3 = calculateWg3(finalValue);
    this.setData({
      wg3: wg3
    });
    const db = wx.cloud.database();
    const databaseArray = [];
    //const final3=this.data.final2;
    const fetchWordData3 = (collection, size) => {
      return db.collection(collection)
        .aggregate()
        .sample({ size: size })
        .end()
        .then(res => res.list.map(item => item.headword.trim()));
    };

    const collectionName = `word${finalValue - 1}`; // 构建集合名
    const fetchPromises = Array.from({ length: 40 }, (_, index) => {
      return fetchWordData3(collectionName, 1).then(words => ({
        collection: collectionName,
        words: [{ word: words[0] }],
        count: '0',
      }));
    });

    Promise.all(fetchPromises).then(results => {
      results.forEach(result => {
        databaseArray.push(result);
      });

      for (let i = 0; i < 40; i++) {
        databaseArray[i].count = 1; // 依次赋值为2到21
      }

      //console.log('获取的选项数据3:', databaseArray);

      wx.cloud.downloadFile({
        fileID: this.data.cloudpath,
        timeout: '10000000',
        success: res => {
          if (res.statusCode === 200) {
            const wordListContent = res.tempFilePath;
            wx.getFileSystemManager().readFile({
              filePath: wordListContent,
              encoding: 'utf8',
              success: res => {
                const wordListContent = res.data;
                const wordListArray = wordListContent.split('\n').map(word => word.trim());
               console.log('wordListArray',wordListArray);
                let weightSum = 0;
                wordListArray.forEach(word => {
                  databaseArray.forEach(database => {
                    database.words.forEach(dbWord => {
                      //if (this.isSubsequenceMatch(dbWord.word, word, 3)) { 
                        if(dbWord.word === word) { //若有匹配单词则权重累计增加
                          weightSum += database.count;
                      }
                    });
                  });
                });
                console.log('weightSum3',weightSum)
                let total=40
                let score=0,
                rate3=weightSum/total;
                this.setData({
                  rate3:rate3
                })
                score=this.data.wg1*this.data.wr1*this.data.rate1+this.data.wg2*this.data.wr2*this.data.rate2+this.data.wg3*this.data.wr3*this.data.rate3;
                console.log('rate3',rate3);//得出正确率：最终结果
                console.log('wg3',wg3);
                console.log('score',score);
              },
              fail: err => {
                console.error('读取文件失败:', err);
                reject(err); // Reject if readFile fails
              }
            });
          } else {
            console.error('下载文件失败');
            reject('下载文件失败'); 
          }
        },
        fail: err => {
          console.error('下载文件失败:', err);
          reject(err); 
        }
      });

    });
    },

    



  addUserToDatabase(username, Result) {
    const db = wx.cloud.database();
    // 使用云开发插入数据的方法
    db.collection('user').add({
      data: {
        username: username,
        result: Result,
        timestamp: db.serverDate()  // 添加时间戳
      },
      success: res => {
        //console.log('用户数据存入数据库成功', res);
      },
      fail: err => {
        console.error('用户数据存入数据库失败', err);
      }
    });
  },

  saveUserResult() {
    const username = wx.getStorageSync('userName');  // 从本地缓存获取用户名
    const finalResult = this.data.score;  // 假设 final 存储在页面数据中
    if (username && finalResult) {
      this.addUserToDatabase(username, finalResult);
    } else {
      console.error('用户名或 final 值为空，无法保存到数据库');
    }
  },
  
  onLoad(options) {
    if (options.final) {
      const final = options.final;
      this.setData({
        final: final
      });
    }
    if (options.wg3) {
      this.setData({
        wg3:options.wg3
      });
    }
    if (options.total1) {
      this.setData({
        total1: parseInt(options.total1, 10)
      });
    }
    if (options.total2) {
      this.setData({
        total2: parseInt(options.total2, 10)
      });
    }
    console.log('最后收到的total1为',this.data.total1)
    console.log('最后收到的total2为',this.data.total2)
    console.log('最后收到的wg3为',this.data.wg3)
    this.getData();
    /*
    this.testAlgorithm()
    .then(() => {
      return this.testAlgorithm2(); // 使用返回的 Promise 来等待 testAlgorithm2 完成
    })
    .then(() => {
      //console.log('test2已调用结束');
      // 确保 final2 被计算出来后调用 testAlgorithm3
      this.testAlgorithm3(this.data.final2);
    })
    .then(() => {
      //console.log('testAlgorithm3() 已调用');
    })
    .catch(err => {
      console.error('出错:', err);
    });
    */
    },
    
  
  onShow() {
    console.log('Received Final:', this.data.final); //调试
  },  
})
