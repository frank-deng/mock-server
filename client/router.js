import { createRouter,createWebHashHistory} from "vue-router";
import mainPage from '@/views/mainPage.vue';
import addItem from '@/views/addItem.vue';

const routes=[
    {
        path:"/",
        component:mainPage
    },
    {
        path:"/add",
        component:addItem
    }
];
export default createRouter({
    history:createWebHashHistory(),
    routes
});
