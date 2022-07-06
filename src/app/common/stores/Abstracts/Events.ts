export type EventProps = {
    label: string,
    action: string,
    category: string,
};

export default abstract class Events {
    // eslint-disable-next-line no-unused-vars
    public abstract send(props: EventProps): void;
}
