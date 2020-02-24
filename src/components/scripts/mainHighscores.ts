import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from "axios";
import * as request from 'request';


@Component
export default class Highscores extends Vue {
    @Prop() private msg!: string;
    @Prop() private highscores!: Array<Highscore>;
    @Prop() private timer!: number;
    @Prop() private apiUrl = 'http://localhost:3002';


    async created() {
        try {
            const res = await axios.get(this.apiUrl);
            this.highscores = res.data;

        } catch (e) {
            console.log("Error while receiving json data");
        }
    }
    verifyIfEligibleForHighscore(highscore: Highscore) {
        return this.highscores[this.highscores.length-1].score < highscore.score;
    }
    addHighscore(highscore: Highscore){
        this.highscores.push(highscore);
        this.sortHighscores();
    }
    switchLastHighscore(highscore: Highscore){
        this.highscores.pop();
        this.addHighscore(highscore);
    }
    httpCall(method: string, data: Highscore) {

        const xhr = new XMLHttpRequest();
        xhr.open(method, this.apiUrl + "/highscores", true);
        if (data != null) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
        else xhr.send();
    }
    async clearHighscores(){
        console.log("dupa");
        setTimeout(() => console.log(this.highscores), 2000);
        // console.log(this.highscores);
        for(let i = 0; i < this.highscores.length; i++){
            await axios.delete(this.apiUrl + "/highscores/" + (i+1));
        }
    }
    async fillHighscores(){
        //TODO
    }

    sortHighscores(){
        this.highscores.sort(function (a, b) {
            return b.score - a.score;
        });
    }
    isHighscoresFull(){
        return this.highscores.length >= 10;
    }

}