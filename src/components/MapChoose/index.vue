<template>
  <div v-if="dialogShow">
    <el-dialog
      title="选择地址"
      width="1200px"
      :before-close="hide"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      append-to-body
      class="site"
    >
      <div v-if="dialogShow">
        <div class="searchBox">
          <div>
            <el-input
              style="width: 80%"
              v-model="inputValue"
              placeholder="搜索地名或者地址"
              id="tipinput"
              prefix-icon="el-icon-search"
              class="searchInput"
            ></el-input>
            <el-button type="primary" size="small" @click="initMapByInput"
              >查询</el-button
            >
          </div>
          <div
            class="searchContainer"
            v-if="markers.length > 0 && searchContainerShow"
          >
            <div
              class="searchItem"
              v-for="(item, index) in markers"
              :key="item.id"
              :style="activeIndex === index && 'background: #ecf5ff'"
              @click="itemChange(item, index)"
            >
              <div>{{ item.name }}</div>
              <div
                style="color: #999; font-size: 12px; margin-left: 10px"
                class="textOverflow"
              >
                {{ item.address }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-amap
            ref="map"
            vid="amapDemo"
            :center="center"
            :zoom="zoom"
            :plugin="plugin"
            class="amap-demo"
            :events="events"
          >
            <el-amap-marker :position="center" key="100"></el-amap-marker>
          </el-amap>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer d-flex justify-content-between align-items-center"
      >
        <div style="font-size: 16px">所选位置：{{ currentValue }}</div>
        <div>
          <el-button type="primary" @click="save">确 定</el-button>
          <el-button @click="hide">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入获取实例
import { AMapManager } from "vue-amap";

let amapManager = new AMapManager();
let Geocoder;
export default {
  name: "MapChoose",
  components: {},
  props: {
    dialogShow: {},
    //精度
    lng: {},
    //维度
    lat: {},
    primitiveData_comp: {},
  },

  data() {
    const that = this;
    return {
      tabIndex: "",
      currentValue: "",
      address_formatted: "",
      searchContainerShow: false,
      markers: [],
      activeIndex: "",
      zoom: 12,
      center: this.primitiveData_comp,
      searchOption: {
        citylimit: false,
      },
      resultValue: {},
      inputValue: "",
      searchResult: {
        address: "",
        latitude: "",
        longitude: "",
        name: "",
        type: "",
        country: "",
        province: "",
        city: "",
        area: "",
        township: "",
        street: "",
        neighborhood: "",
        locationName: "",
      },
      events: {
        // 地图上的点击事件
        click: (e) => {
          this.$nextTick(() => {
            let that = this;
            that.position = [e.lnglat.lng, e.lnglat.lat];
            that.center = [e.lnglat.lng, e.lnglat.lat]; //打点
            let geocoder = new AMap.Geocoder({});
            geocoder.getAddress(that.position, function (status, result) {
              if (status === "complete" && result.info === "OK") {
                that.resultValue = result.regeocode.addressComponent;
                console.log("result", result);
                let obj = result.regeocode.addressComponent;
                let value =
                  obj.province +
                  obj.city +
                  obj.district +
                  obj.township +
                  obj.street +
                  obj.streetNumber +
                  (obj.building || "");
                that.currentValue = value;
                that.address_formatted = result.regeocode.formattedAddress;
              }
            });
          });
          this.searchContainerShow = false;
        },
      },
      plugin: [
        {
          enableHighAccuracy: true, //是否使用高精度定位，默认true
          timeout: 100, //超过10秒后停止定位，默认：无穷大
          convert: true, //自动偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          extensions: "all",
          pName: "Geolocation", //AMap-Geolocation 定位插件
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  let obj = result.addressComponent;

                  that.resultValue = result.addressComponent;
                  let value =
                    obj.province ||
                    "" + obj.city ||
                    "" + obj.district ||
                    "" + obj.township ||
                    "" + obj.street ||
                    "" + obj.streetNumber + (obj.building || "");
                  that.currentValue = value;
                  that.address_formatted = result.regeocode.formattedAddress;

                  that.lng = result.position.lng; //设置经度
                  that.lat = result.position.lat; //设置纬度
                  that.center = [that.lng, that.lat]; //设置坐标
                  that.markers.push(that.center); //获取当前定位并存入标记中显示标记点
                  that.loaded = true; //load
                  that.zoom = 14;
                  that.$nextTick(); //页面渲染好后
                }
              });
            },
          },
        },
        //Geocoder编码：根据地理名称来获得地点的经纬度
        {
          pName: "Geocoder",
          events: {
            init: (o) => {
              Geocoder = o; // o 则是AMap.Geocoder的实例 对外部的Geocoder变量进行赋值，在任何地方就都可以使用
              //data里的events中使用了Geocoder
              o.getAddress(that.center, function (status, result) {
                //根据坐标获取位置
                if (status === "complete" && result.info === "OK") {
                  let obj = result.regeocode.addressComponent;
                  that.resultValue = result.regeocode.addressComponent;
                  // console.log("result.", result);
                  let value =
                    obj.province +
                    obj.city +
                    obj.district +
                    obj.township +
                    obj.street +
                    obj.streetNumber +
                    (obj.building || "");
                  that.currentValue = value;
                  that.address_formatted = result.regeocode.formattedAddress;
                }
              });
            },
          },
        },
      ],
    };
  },
  computed: {},
  watch: {
    dialogShow(val) {
      if (val) {
        if (this.lng && this.lat) {
          this.center[0] = this.lng;
          this.center[1] = this.lat;
        }
        this.inputValue = this.primitiveData_comp.name;
        this.markers = [];
      }
    },
    inputValue(value) {
      if (value) {
        // 监听输入内容
        // this.initMapByInput()
      }
    },
  },
  mounted() {
    console.log("primitiveData_comp:", this.primitiveData_comp);
  },
  methods: {
    itemChange(n, index) {
      const that = this;
      that.activeIndex = index;
      // 输入后搜索出来的，反地理编码出来的参数有所不同
      let lng = n.lng || n.longitude || n.location.lng;
      let lat = n.lat || n.latitude || n.location.lat;
      let name = n.name || "";
      that.inputValue = name;
      that.zoom = 13;
      that.position = [lng, lat];
      // that.searchResult.address = n.address
      // that.searchResult.latitude = lat
      // that.searchResult.longitude = lng
      // that.searchResult.name = name
      let geocoder = new AMap.Geocoder({});
      geocoder.getAddress(that.position, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          console.log("result", result);
          let obj = result.regeocode.addressComponent;
          that.resultValue = result.regeocode.addressComponent;

          // that.searchResult.locationName = obj.province + obj.city + obj.district + obj.township + obj.street +
          //   obj.streetNumber + (n.address || obj.building || '')
          that.currentValue ==
            obj.province +
              obj.city +
              obj.district +
              obj.township +
              obj.street +
              obj.streetNumber +
              (n.address || obj.building || "");
          that.address_formatted = result.regeocode.formattedAddress;
        }
      });
      this.searchContainerShow = false;
    },
    initMapByInput() {
      let that = this;
      // 自动搜索插件
      AMap.plugin("AMap.Autocomplete", () => {
        let autoOptions = {
          city: "全国",
        };
        let autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(that.inputValue, function (status, e) {
          if (status === "complete" && e.info === "OK") {
            if (e.tips && e.tips.length > 0) {
              let tips = e.tips.filter((i) => {
                return i.location && i.address.length > 0;
              });
              let tip = tips[0];
              that.center = [tip.location.lng, tip.location.lat];
              that.zoom = 13;
              that.position = [tip.location.lng, tip.location.lat];
              that.markers = tips;
              // that.searchResult.address = tip.address
              // that.searchResult.latitude = tip.location.lat
              // that.searchResult.longitude = tip.location.lng
              // that.searchResult.name = tip.name
              let geocoder = new AMap.Geocoder({});
              geocoder.getAddress(that.position, function (status, result) {
                if (status === "complete" && result.info === "OK") {
                  let obj = result.regeocode.addressComponent;
                  that.resultValue = result.regeocode.addressComponent;

                  // that.searchResult.locationName = obj.province + obj.city + obj.district + obj.township +
                  //   obj.street + tip.address
                  that.currentValue =
                    obj.province +
                    obj.city +
                    obj.district +
                    obj.township +
                    obj.street +
                    tip.address;
                  that.address_formatted = result.regeocode.formattedAddress;
                }
              });
              that.searchContainerShow = true;
            } else {
              that.markers = [];
              that.searchResult = [];
            }
          }
        });
      });
    },
    // 保存提交
    save() {
      if (this.center.length == 0 || !this.currentValue) {
        return this.$message.warning("选择的地点有误，请重新选择");
      }
      this.$emit("locationSure", {
        name: this.address_formatted,
        value: this.center,
        address: this.resultValue,
        address_formatted: this.currentValue,
      });
      this.$emit("update:primitiveData_comp", this.searchResult);
      this.hide();
    },
    // 关闭弹框
    hide() {
      this.dataShow = false;
      this.inputValue = "";
      this.zoom = 12;
      this.center = [116.397455, 39.909187];
      this.$emit("update:dialogShow", false);
    },
  },
};
</script>

<style lang='scss' scoped>
ul,
dl {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

::-webkit-scrollbar {
  display: none;
}

.amap-demo {
  width: 100%;
  height: 600px;
  position: relative;
}

.site ::v-deep {
  .el-dialog__body {
    padding: 0;
    border-bottom: 1px solid #e4e4e4;
  }

  .app-container {
    padding: 0;
  }

  .search-box {
    height: 35px;
    margin: 10px auto;
    width: calc(100% - 20px);
    // border-radius:16px;
    box-shadow: none;
    background: #ffff;
    border: 1px solid #e6e6e6;

    .search-box-wrapper {
      input {
        background: #fff;
        padding-left: 20px;
      }

      .search-btn {
        color: #2a67fe;
        width: 90px;
        height: 20px;
        box-sizing: border-box;
        border-left: 1px solid #d7d7d7;
      }
    }
  }
}

.searchBox {
  width: 100%;
  background: #fff;
  font-size: 13px;
  color: #333333;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 999;
  margin-top: 10px;

  .searchContainer {
    height: 180px;
    margin-top: 10px;
    overflow-y: auto;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .searchItem {
    color: #333;
    font-size: 13px;
    text-align: left;
    padding: 7px 10px;
    display: flex;
    border-bottom: 1px solid #e6e6e6;
    cursor: pointer;
  }
}

::v-deep .el-vue-search-box-container .search-tips {
  width: 100%;
  top: 100%;
  max-height: 190px;
  overflow: auto;
}

.active {
  background: #dbe5f2;
}

.searchInput {
  margin: 0px 10px;
  background: #f7f8fa;
  border-radius: 16px;
  margin-top: 5px;
  height: 32px;
  width: calc(100% - 20px);
  box-sizing: border-box;
}
</style>