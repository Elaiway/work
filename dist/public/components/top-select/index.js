// dist/public/components/top-select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trees: {
      type: Array,
      value: []
    },
    color:{
      type:String,
      value:''
    },
    // pcindex: {
    //   type: Array,
    //   value: [],
    //   observer(newVal) {
    //     console.log(newVal)
    //     if(newVal.length>0){
    //     let title;
    //     if (newVal[1]>0){
    //       title = this.data.trees[1].items[newVal[0]].son[newVal[1]].name
    //     }
    //     else{
    //       title = this.data.trees[1].items[newVal[0]].name
    //     }
    //     this.setData({
    //       'trees[1].title':title
    //     })
    //   }
    //   }
    // },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pindex:0,
    cindex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidebg: function (e) {
      this.setData({
        shownavindex: -1,
        isfull: false,
      })
    },
    //选择Nav
    clickNav: function (e) {
      let navIndex = e.currentTarget.dataset.nav
      this.setData({
        //渲染当前trees第几项数据
        treesInex: navIndex,
        //nav激活状态控制
        shownavindex: this.data.isfull && this.data.shownavindex == navIndex ? -1 : navIndex,
        //控制遮罩与trees里items显示
        isfull: this.data.shownavindex == navIndex ? !this.data.isfull : true,
      })
      console.log(e.currentTarget.dataset)
      this.navChange()
    },
    //点击下拉框左侧内容
    typesl: function (e) {
      let pindex = e.currentTarget.dataset.pindex, co = this.data, treesInex = co.treesInex, treesItem = co.trees[treesInex];
      // treesItem.items[pindex].active=true;
      this.setData({
        pindex,
        cindex:-1,
        // trees,
        // [`trees[${shownavindex}].items[${pindex}].avtive`]:true  这样深层改变数据，页面没有响应刷新
      })
      if (!treesItem.items[pindex].son || treesItem.items[pindex].son.length==0){
        // treesItem.title = treesItem.items[pindex].name
        this.setData({
          isfull: false,
          [`trees[${treesInex}].title`]: treesItem.items[pindex].name
        })
        this.triggerEvent('selectchange', treesItem.items[pindex])
      }
      console.log(treesInex,pindex,)
    },
    //点击下拉框右侧内容
    typesr: function (e) {
      var cindex = e.currentTarget.dataset.cindex, pindex = this.data.pindex, co = this.data, treesInex = co.treesInex, treesItem = co.trees[treesInex];
      this.setData({
        cindex,
        isfull: false,
        [`trees[${treesInex}].title`]: cindex ? treesItem.items[pindex].son[cindex].name : treesItem.items[pindex].name
      });
      this.triggerEvent('selectchange', treesItem.items[pindex].son[cindex])
    },
    navChange(){
      //获取之前选中的trees每一项items的索引
      let co = this.data, treesInex = co.treesInex, treesItem = co.trees[treesInex],pindex=-1,cindex=-1;
      pindex = treesItem.items.findIndex(item => item.name == treesItem.title);
      if(pindex==-1){
        for (let i = 0; i < treesItem.items.length;i++){
          if (treesItem.items[i].son){

          let findcindex = treesItem.items[i].son.findIndex(item => item.name == treesItem.title)
            if (findcindex>-1){
            pindex = i, cindex = findcindex
            break
          }
          }
        }
      }
      pindex<0&&(pindex=0)
      this.setData({
        pindex,
        cindex,
      })
      console.log(treesItem, treesItem.title, pindex, cindex)
    },
  }
})
