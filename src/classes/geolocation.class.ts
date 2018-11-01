export class Geolocation {
    static getLocation(): Promise<Coordinates> {
        return new Promise<Coordinates>(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve(pos.coords),
                    (err) => reject(err)
                );
            }
        );
    }
}
