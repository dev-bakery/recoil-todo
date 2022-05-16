import { RecoilRoot } from 'recoil';
import Calendar from "./components/calendar";

function App() {
    return (
        <div className="App">
            <RecoilRoot>
                <Calendar />
            </RecoilRoot>
        </div>
        );
}

export default App;
