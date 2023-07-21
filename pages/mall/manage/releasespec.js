// pages/yellow/sett.js
var app = getApp();
Page({
  data: {
    spec: [],
    syncMoney: '',
    syncNum: '',
    syncVipMoney: '',
    money: '',
    num: '',
    vipMoney: '',
    group: [],
    //编辑时传进来
    parentSpec: [],
    parentGroup: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('编辑商品规格')
    app.setNavigationBarColor(this);
    this.setData({
      system: app.system,
      goodsId: options.goodsId,
    })
    let parentSpec = JSON.parse(options.parentSpec),
      parentGroup = JSON.parse(options.parentGroup)
    if (parentSpec.length > 0) {
      this.setData({
        spec: parentSpec.map((item) => ({
          spec_name: item.name,
          spec_val: item.data.map((item) => {
            return {
              spec_val_name: item
            }
          }),
        })),
        parentGroup,
      })
      this.group()
    }
    console.log(options, parentSpec)
  },
  addSpecMethod() {
    let spec = this.data.spec
    if (spec.length > 2) return app.util.getShowtoast('最多添加3组规格', 1500, 2)
    let specObj = {
      spec_name: '规格' + spec.length,
      spec_val: [
        // {spec_val_name:'',}
      ]
    }
    this.setData({
      [`spec[${spec.length}]`]: specObj
    })
    this.group()
    console.log(this.data.spec)
  },
  delSpecMethod(e) {
    let spec = this.data.spec,
      pindex = e.currentTarget.dataset.pindex
    spec.splice(pindex, 1)
    this.setData({
      spec,
    })
    this.group()
    console.log(e.currentTarget.dataset, spec, this.data.spec)
  },
  addSpecVal(e) {
    let pindex = e.currentTarget.dataset.pindex,
      spec = this.data.spec,
      specValObj = {
        spec_val_name: '属性' + pindex + spec[pindex].spec_val.length,
      }
    this.setData({
      [`spec[${pindex}].spec_val[${spec[pindex].spec_val.length}]`]: specValObj
    })
    this.group()
    console.log(pindex, this.data.spec)
  },
  delSpecVal(e) {
    let pindex = e.currentTarget.dataset.pindex,
      index = e.currentTarget.dataset.index,
      spec = this.data.spec
    spec[pindex].spec_val.splice(index, 1)
    this.setData({
      spec,
    })
    this.group()
    console.log(pindex, index, this.data.spec)
  },
  //大规格名称
  specNameInput(e) {
    let spec = this.data.spec,
      pindex = e.currentTarget.dataset.pindex
    this.setData({
      [`spec[${pindex}].spec_name`]: e.detail.value
    })
    console.log(e, spec)
  },
  //小规格名称
  specValNameInput(e) {
    let pindex = e.currentTarget.dataset.pindex,
      index = e.currentTarget.dataset.index,
      spec = this.data.spec
    this.setData({
      [`spec[${pindex}].spec_val[${index}].spec_val_name`]: e.detail.value
    })
    this.group()
  },
  //规格生成
  group() {
    if (!this.data.spec.length) {
      return this.setData({
        group: []
      })
    }
    let _result_arr = this.data.spec.map(_e => _e['spec_val']),
      parentGroup = this.data.parentGroup
    // 笛卡尔积
    let _recursion_spec_obj = (data) => {

      let len = data.length
      if (len >= 2) {
        let len1 = data[0].length
        let len2 = data[1].length
        let newlen = len1 * len2
        let temp = new Array(newlen)
        let index = 0
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (Array.isArray(data[0][i])) {
              temp[index] = [...data[0][i], data[1][j]]
            } else {
              temp[index] = [data[0][i], data[1][j]]
            }
            index++
          }
        }
        let newArray = new Array(len - 1)
        for (let i = 2; i < len; i++) {
          newArray[i - 1] = data[i]
        }
        newArray[0] = temp
        return _recursion_spec_obj(newArray)
      } else {
        return data[0]
      }

    }
    // console.log('_result_arr',_result_arr,_recursion_spec_obj(_result_arr))
    // return
    this.setData({
      group: _recursion_spec_obj(_result_arr).map((item) => {
        let arr = [];
        item.length > 1 ? item.forEach((item) => {
          arr.push(item.spec_val_name.trim())
        }) : arr = item.spec_val_name.trim();
        //如果编辑传入了group,根据编辑数据里的库存和价格渲染
        if (parentGroup.length) {
          let groupInfo = parentGroup.find(item => item.data == arr.toString())
          return {
            data: arr.toString(),
            money: groupInfo && groupInfo.money || this.data.money,
            num: groupInfo && groupInfo.num || this.data.num,
            vipMoney: groupInfo && groupInfo.vipMoney || this.data.vipMoney,
          }
        } else {
          return {
            data: arr.toString(),
            money: this.data.money,
            num: this.data.num,
            vipMoney: this.data.vipMoney,
          }
        }
      })
    })
    console.log(_recursion_spec_obj(_result_arr), this.data.group)
  },
  //刷新规格组合表
  refreshGroup() {
    this.setData({
      money: '',
      num: '',
      vipMoney:''
    })
    this.group()
  },
  //同步输入框
  syncInput(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
    console.log(e.currentTarget.dataset.key, e.detail.value)
  },
  //同步价格
  syncKey(e) {
    let parentGroup = this.data.parentGroup,
      key = e.currentTarget.dataset.key
    console.log(key)
    if (!Number(this.data[key])) return app.util.getShowtoast('请输入合理数据后同步', 1500, 2)
    if (key == 'syncMoney') {
      this.setData({
        money: this.data[key]
      })
      if (parentGroup.length) {
        parentGroup.forEach(item => {
          item.money = this.data[key]
        })
        this.setData({
          parentGroup,
        })
      }
    }
    if (key == 'syncNum') {
      this.setData({
        num: this.data[key]
      })
      if (parentGroup.length) {
        parentGroup.forEach(item => {
          item.num = this.data[key]
        })
        this.setData({
          parentGroup,
        })
      }
    }
    if (key == 'syncVipMoney') {
      this.setData({
        vipMoney: this.data[key]
      })
      if (parentGroup.length) {
        parentGroup.forEach(item => {
          item.vipMoney = this.data[key]
        })
        this.setData({
          parentGroup,
        })
      }
    }
    this.group()
  },
  //规格属性输入框
  specInput(e) {
    this.setData({
      [`group[${e.currentTarget.dataset.index}].${e.currentTarget.dataset.key}`]: e.detail.value
    })
    console.log(this.data.group)
  },
  //确定
  confirm() {
    // if(!this.spec.length){
    //   app.util.getShowtoast('请至少添加一组规格',2000)
    // }
    let spec = this.data.spec,
      group = this.data.group
    for (let i in spec) {
      if (!spec[i].spec_name.trim()) {
        return app.util.getShowtoast('规格名称不能为空', 1500, 2)
      }
      if (!spec[i].spec_val.length) {
        return app.util.getShowtoast('请删除未添加属性的规格', 1500, 2)
      }
      for (let j in spec[i].spec_val) {
        if (!spec[i].spec_val[j].spec_val_name.trim()) {
          return app.util.getShowtoast('规格的属性名称不能为空', 1500, 2)
        }
      }
    }
    for (let i in group) {
      if (!Number(group[i].money) || !Number(group[i].num)) {
        return app.util.getShowtoast('规格组合的价格和库存不能为空', 1500, 2)
      }
    }
    let specData = spec.map((item) => {
      let obj = {}
      obj.name = item.spec_name.trim()
      obj.data = item.spec_val.map((item) => (item.spec_val_name.trim())).toString()
      return obj
    })
    let pages = getCurrentPages(), //获取加载的页面
      prePage = pages[pages.length - 2] //获取当前页面的对象
    //编辑时  
    if (this.data.goodsId) {
      wx.showModal({
        title: '提示',
        content: '确定修改此规格吗？',
        success: (res) => {
          //点击确定
          if (res.confirm) {
            this.setData({
              loading: true,
            })
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo.shopModifySpec,
              'method': 'POST',
              data: {
                goodsId: this.data.goodsId,
                spec: JSON.stringify(specData),
                group: JSON.stringify(group),
              },
            }).then((res) => {
              if (res.code == '1') {
                app.util.getShowtoast('操作成功')
                setTimeout(() => {
                  prePage.getSpec()
                  wx.navigateBack({

                  })
                }, 1000)
              } else {
                this.setData({
                  loading: false,
                })
                app.util.getShowtoast(res.msg, 1000, 1)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      prePage.setData({
        'params.spec': specData || [],
        'params.group': group || [],
        // parentSpec: specData,
        // parentGroup: group,
      })
      wx.navigateBack({

      })
    }
    console.log(specData, group)
  },
  onShow: function() {

  }
})