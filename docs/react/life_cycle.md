##  React生命周期、组件声明、性能优化
```js
class App extends Component {
    constructor(props) {
      super(props);
      console.log('组件实例化时');
    }
    componentWillMount = () => {
      console.log('组件渲染前');
    }
    render(){
        console.log('组件渲染');
        return <div></div>
    }
    componentDidMount = ()=>{
        console.log('组件首次渲染后，只触发一次');
    }
    componentWillReceiveProps = (nextProps)=>{
        console.log('组件的props更新',nextProps);
        console.log('本函数调用完去 shouldComponentUpdate');
    }
    // 性能优化点
    shouldComponentUpdate = (nextProps,nextState)=>{
        console.log('当state发生变化时||当props发生变化时');
        console.log('需要有返回值，如果是false，则不更新组件')
    }
    componentWillUpdate = ()=>{
        console.log('组件更新前');
    }
    //之后再次render
    componentDidUpdate = ()=>{
        console.log('组件更新后');
    }

    componentWillUnmount = ()=>{
        console.log('组件销毁前');
    }
}
```
- 声明组件
```js
//1.函数定义 
// 优势:组件不会被实例化，整体渲染性能得到提升
// 劣势:组件内不能访问this，没有生命周期，除了渲染和处理事件之外几乎什么也不能做
const Hello = (props)=>(
    <div>
        <span>{props.name}</span>
    </div>
)

// 2.类声明
// 优势: 是react 组件标准写法，也能使用上react组件的所有功能，有完整的生命周期..
// 劣势：需要支持ES6，会产生自己的实例，以及this

class IndexPage extends Component {
  state = {
    name:123
  }
  componentDidMount(){
    const that = this;
    setTimeout(()=>{
      that.setState({
        name:"123"
      })
    },1500);  
  }
  change(e){
    this.setState({
      input:e.target.value.trim()
    })
  }
  render() {
    return (
      <div>
          <IndexPage2 text={this.state.name}></IndexPage2>
      </div>
    )
  }
}
```

- 事件绑定
```js
//1.手动绑定this，否则无法读取this 
onClick={this.headClick}
=> //推荐，性能高，只绑定一次 ,但是无法传参
constructor(props){
    super(props);
    this.headClick = this.headClick.bind(this);
}
//=> 不建议，因为这里事件需要注册好几次,可以穿参
onClick={this.headClick.bind(this,...args)}
// => 有参数 推荐写法 利用箭头函数的特性修改this，且可以传入参数
onClick={e=>this.headClick(e,...args)}

```
- JSX  
```js
// JSX 本身其实也是一种表达式
// JSX 代表 Objects
// Babel 转译器会把 JSX 转换成一个名为 React.createElement() 的方法调用。

cosnt hello = ()=>(
    <div className="22">hello World</div>
);


// => JSX

const hello  = React.createElement(h1,{className:"22"},"helloWorld");

```
- 性能优化

```js
// 虚拟化长列表 使用 react-window || react-virtualized 来辅助实现

// 使用 shouldComponentUpdate 来处理，你并非每一次都要更新

// 每次一 state 的更新都返回新的对象

// 合理使用深克隆
```