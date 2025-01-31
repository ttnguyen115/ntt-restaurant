import MenuOrder from './MenuOrder';

function MenuPage() {
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
            <MenuOrder />
        </div>
    );
}

export default MenuPage;
