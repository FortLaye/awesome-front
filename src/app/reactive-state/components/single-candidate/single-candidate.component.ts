import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable, switchMap, take, tap} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CandidateService} from "../../services/candidate.service";

@Component({
    selector: 'app-single-candidate',
    templateUrl: './single-candidate.component.html',
    styleUrls: ['./single-candidate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCandidateComponent implements OnInit {

    loading$!: Observable<boolean>;
    candidate$!: Observable<Candidate>;


    constructor(private route: ActivatedRoute,
                private candidateService: CandidateService,
                private router: Router) { }

    ngOnInit(): void {
        this.candidate$ = this.route.params.pipe(
            switchMap(params => this.candidateService.getCandidateById(+params['id']))
        )
    }

    onHire() {

    }
    onRefuse(){
        this.candidate$.pipe(
            take(1),
            tap(candidate => {
                this.candidateService.refuseCandidate(candidate.id);
                this.onGoBack();
            })
        ).subscribe()
    }
    onGoBack(){
        this.router.navigateByUrl('/reactive-state/candidates');
    }
}
