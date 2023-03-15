let eventBus = new Vue()

Vue.component('cards-kanban', {
    template: `
    <div>
        <fill></fill>
        <div id="columns">
            <column1 :column1="column1"></column1>
            <column2 :column2="column2"></column2>
            <column3 :column3="column3"></column3>
            <column4 :column4="column4"></column4>
        </div>
    </div>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            column_3: [],
            ShowCard:true,
        }
    },
    mounted() {
        eventBus.$on('card-create', card => {
            this.column1.push(card)
        })
        eventBus.$on('moving1', card => {
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)

        })
        eventBus.$on('moving2', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
        eventBus.$on('moving3-2', card => {
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
        })
        eventBus.$on('moving3-4', card => {
            this.column4.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
            card.dateE = card.dateE.split('.').reverse().join('-')
            console.log(card)
            if (card.dateE > card.dateD){
                card.inTime = false
            }
        })
    }
})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
            <p class="main_text">Заметки</p>
        <div class="form_control">
                
            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>
            <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>
            <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
            <input required type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
             <input required type="text" v-model="point_5"  placeholder="Пятый пункт"/>
        </div>
        <div>                    
                <p class="sub">
                        <input type="submit" value="Отправить"> 
                </p>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
            date: null,
        }
    },
    methods: {

        Submit() {
            let card = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: null,
                // date: null,
                status: 0,
                errors: [],
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }

})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
                <div class="card" v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            task.completed = true
            ColumnCard.status += 1
            console.log("Проверочка" + ColumnCard.status)
            if (ColumnCard.status === 3 && !this.point_5 && !this.point_4) {
                console.log("1" + ColumnCard.status)
                eventBus.$emit('addColumn_2', ColumnCard)
            }
        },
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_two">
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            task.completed = true
            ColumnCard.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                count++
            }
            if (( ColumnCard.status / count) * 100 >= 100) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()
            }
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
                <div class="card" v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                        <p>Выполнено {{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})



let app = new Vue({
    el: '#app',
})