import { create_app } from './app'

async function main() {
    const app = await create_app();
    app.listen(5000, (err, address) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(`listening at ${address}`)
        app.blipp();
    })
}

main()