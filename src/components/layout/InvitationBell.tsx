import { useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useIsAuthenticated } from "../../store/auth/useAuthStore";
import {
	useMyInvitations,
	useRespondInvitation,
} from "../../hooks/invitation/useInvitation";

export default function InvitationBell() {
	const isAuthenticated = useIsAuthenticated();
	const [isOpen, setIsOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	const { data: invitations = [] } = useMyInvitations();
	const respondMutation = useRespondInvitation();
	const pending = invitations.filter((inv) => inv.status === "PENDING");

	useEffect(() => {
		if (!isOpen) return;
		const onMouseDown = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		window.addEventListener("mousedown", onMouseDown);
		return () => window.removeEventListener("mousedown", onMouseDown);
	}, [isOpen]);

	if (!isAuthenticated) return null;

	const handleRespond = (
		invitationId: number,
		status: "ACCEPTED" | "DECLINED"
	) => {
		respondMutation.mutate({ invitationId, body: { status } });
	};

	return (
		<div ref={panelRef} className="relative">
			<button
				onClick={() => setIsOpen((v) => !v)}
				aria-label="초대함"
				className="relative px-2 sm:px-3 py-1 sm:py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
				<Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
				{pending.length > 0 && (
					<span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
						{pending.length}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-gray-100 bg-white shadow-xl z-50 py-2">
					<p className="px-4 py-1.5 text-xs font-semibold text-gray-500">
						초대함
					</p>
					{pending.length === 0 ? (
						<p className="px-4 py-4 text-center text-sm text-gray-400">
							받은 초대가 없습니다.
						</p>
					) : (
						pending.map((inv) => (
							<div
								key={inv.id}
								className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-gray-50">
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-gray-900">
										{inv.cart_name}
									</p>
									<p className="truncate text-xs text-gray-500">
										{inv.inviter_name}님의 초대
									</p>
								</div>
								<div className="flex shrink-0 gap-1">
									<button
										onClick={() => handleRespond(inv.id, "ACCEPTED")}
										aria-label="수락"
										className="rounded-md p-1.5 text-green-600 hover:bg-green-50">
										<Check className="h-4 w-4" />
									</button>
									<button
										onClick={() => handleRespond(inv.id, "DECLINED")}
										aria-label="거절"
										className="rounded-md p-1.5 text-red-500 hover:bg-red-50">
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
