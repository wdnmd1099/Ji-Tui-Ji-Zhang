import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { Time } from "../../shared/time";
import { refExpensesMoney, refIncomeMoney } from "./ItemList";
import s from './ItemSummary.module.scss';
export const ItemSummary = defineComponent({
  props: {
    startDate: { //开始日期
      type: String as PropType<string>,
      required: true,
    },
    endDate: { // 结束日期
      type: String as PropType<string>,
      required: true,
    },
    refData: {
      type: Array as PropType<any>,
      required: true,
    },
  },
  setup(props, context) {
    
    const startDate = props.startDate.match(/[0-9]+/gm)
    const endDate = props.endDate.match(/[0-9]+/gm)
    const refNumDate = reactive({
      sYYYY: parseInt(startDate![0]),
      sMM: parseInt(startDate![1]),
      sDD: parseInt(startDate![2]),
      eYYYY: parseInt(endDate![0]),
      eMM: parseInt(endDate![1]),
      eDD: parseInt(endDate![2]),
    })
    // console.log(startDate,endDate)
    watch(()=>[props.startDate,props.endDate], ()=>{
      const startDate = props.startDate.match(/[0-9]+/gm)
    const endDate = props.endDate.match(/[0-9]+/gm)
    const refNumDate = reactive({
      sYYYY: parseInt(startDate![0]),
      sMM: parseInt(startDate![1]),
      sDD: parseInt(startDate![2]),
      eYYYY: parseInt(endDate![0]),
      eMM: parseInt(endDate![1]),
      eDD: parseInt(endDate![2]),
    })
    
    })
    console.log(startDate,endDate)


    return () => (<>
    {console.log(startDate,endDate)}
      <div class={s.outsideWrapper}>
        <div class={s.hiddenDiv}></div>
        <div class={s.total}>
          <li class={s.income}>
            <span>收入</span>
            <span>￥ {refIncomeMoney.value.toFixed(2)}</span>
          </li>
          <li class={s.expenditure}>
            <span>支出</span>
            <span>￥ {refExpensesMoney.value.toFixed(2)}</span>
          </li>
          <li class={s.netIncome}>
            <span>净收入</span>
            <span>￥ {(refIncomeMoney.value - refExpensesMoney.value).toFixed(2)}</span>
          </li>
        </div>
        {props.refData?.map((item: {
          kind: any; tags: any; created_at: any; id: any; amount: any;
        }) => {
          const time = item.created_at.match(/^.{10}/gm)[0]
            + " " + item.created_at.match(/.{2}:.{2}:.{2}/gm)[0];
          //  console.log(item)
          console.log(1)
          
          const matchDate = item.created_at.match(/^.{10}/gm)
          // console.log(parseInt(matchDate[0]))
          let cc:any = false



          matchDate.map((item: any) => {
            const itemMatched = item.match(/[0-9]+/gm)
            if (parseInt(itemMatched[0]) != refNumDate.sYYYY) {   // 年份不相等直接return
              return 
            } else if (parseInt(itemMatched[1]) >= refNumDate.sMM // 月份大于等于开始并小于等于结束 
              && parseInt(itemMatched[1]) <= refNumDate.eMM) {
              if (parseInt(itemMatched[1]) != refNumDate.sMM // 如果不等于开始月并不等于结束月，直接放行
                && parseInt(itemMatched[1]) != refNumDate.eMM) {
                cc = true
              } else if (parseInt(itemMatched[1]) === refNumDate.sMM  // 如果等于开始或结束月，判断是否大于开始日 或 是否小于结束日 ，是就return 否就放行
                || parseInt(itemMatched[1]) === refNumDate.eMM) {
                if (parseInt(itemMatched[2]) > refNumDate.sDD
                  || parseInt(itemMatched[2]) < refNumDate.eDD) {
                  cc = true
                }
              }
            }
          })

          
          if(cc === false){
            // refX.push(item)
            // console.log(refX)
            return undefined
          }



          return (
            <div class={s.wrapper} onClick={() => { console.log(props.startDate, props.endDate) }}>
              <div class={s.emoji}>{item.tags[0].sign}</div>
              <span class={s.id}>
                {item.tags[0].name}
              </span>
              <span class={s.time}>{time}</span>
              <span class={[s.money, [item.kind === 'expenses' ? '' : s.IncomeMoney]]}>￥ {item.amount / 100}</span>
            </div>
          )
        })
        }
        <div>{context.slots?.default?.()}</div>
      </div>
    </>
    )
  }
})